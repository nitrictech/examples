from typing import Any, Dict
from nitric.resources import api
from nitric.application import Nitric
from nitric.context import HttpContext
from llama_cpp import Llama, llama_get_timings
import os
import threading

llm = None
llm_lock = threading.Lock()

MODEL_NAME = os.environ.get('MODEL_NAME', '')


def get_llm():
    global llm
    with llm_lock:
        if llm is None:
            print("initializing model")
            llm = Llama(model_path=f"./models/{MODEL_NAME}", verbose=False) if MODEL_NAME != '' else None
            print("model initialized")

    return llm


main = api("main")

system_prompt = os.environ.get('SYSTEM_PROMPT', 'You are a helpful assistant')


def ctypes_struct_to_dict(struct) -> Dict[str, Any]:
    return {field: getattr(struct, field) for field, _ in struct._fields_}


@main.post("/chat")
async def hello_world(ctx: HttpContext):
    body = ctx.req.json

    print("Getting model")

    try:
        model = get_llm()

        print("Got Model")

        if model is None:
            ctx.res.status = 500
            ctx.res.body = "LLM not configured"
            return ctx

        if body is None:
            ctx.res.status = 400
            ctx.res.body = "No body"
            return ctx

        # ctx.res.body = {}
        user_prompt = body['prompt']
        prompt = f'<|start_header_id|>system<|end_header_id|>{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>{user_prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>'
        max_tokens = body['max_tokens'] if 'max_tokens' in body else -1
        temperature = body['temperature'] if 'temperature' in body else 0.1
        output: Any = model(prompt, max_tokens=max_tokens, temperature=temperature)
        # ctx.res.body['output'] = output
        timings = ctypes_struct_to_dict(llama_get_timings(model._ctx.ctx))
        
        tps = output['usage']['total_tokens'] / (timings['t_eval_ms'] / 1000)

        ctx.res.body = {
            'output': output,
            'timings': timings,
            'tps': tps,
        }

        ctx.res.status = 200

    except Exception as e:
        ctx.res.status = 500
        ctx.res.body = f"Error {e}"

    return ctx

Nitric.run()
