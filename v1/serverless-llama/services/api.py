import uuid
import time
from nitric.resources import bucket
from nitric.application import Nitric
from llama_cpp import Llama
from nitric.resources import api
from nitric.application import Nitric
from nitric.context import HttpContext

llama_model = Llama(model_path="./models/Llama-3.2-1B-Instruct-Q4_K_M.gguf")

translations_bucket = bucket("translations").allow("write")

# Function to perform translation using the local model
async def translate_text(text):
    prompt = f'Translate "{text}" to Spanish.'
    
    start_time = time.time()

    # Generate a response using the locally stored model
    response = llama_model(
        prompt=prompt,
        max_tokens=150,  
        temperature=0.7,  # Adjust temperature for response creativity
        top_p=0.9,
        stop=["\n"]  # Stop generating text when a newline is encountered
    )
    
    # Calculate evaluation time in milliseconds
    end_time = time.time()
    t_eval_ms = (end_time - start_time) * 1000
    
    # Calculate tokens per second
    total_tokens = response['usage']['total_tokens']
    tps = total_tokens / (t_eval_ms / 1000)

    translated_text = response['choices'][0]['text'].strip()
    
    return translated_text, response, t_eval_ms, tps

main = api("main")

@main.post("/translate")
async def hello_world(ctx: HttpContext):
    text = ctx.req.json["text"]

    unique_id = str(uuid.uuid4())

    try:
        translated_text, output, t_eval_ms, tps = await translate_text(text)
        
        translated_bytes = translated_text.encode()
        file_path = f"translations/{unique_id}/translated.txt"
        await translations_bucket.file(file_path).write(translated_bytes)

        # print(f"Translation completed and saved to {file_path}")

        ctx.res.body = {
            'output': output,
            't_eval_ms': t_eval_ms,
            'tps': tps,
        }

    except Exception as e:
        print(f"Error during translation: {str(e)}")

Nitric.run()
