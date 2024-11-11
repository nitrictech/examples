import os

from common.model import embed_model, llm, text_qa_template
from common.resources import main_api

from nitric.context import HttpContext
from nitric.application import Nitric
from llama_index.core import StorageContext, load_index_from_storage, Settings

persist_dir = "local-query-engine"
Settings.llm = llm
Settings.embed_model = embed_model

@main_api.get("/prompt")
async def query_model(ctx: HttpContext):

  query = ctx.req.query['query'][0]

  print(f"Querying model: \"{query}\"")

  if os.path.exists(persist_dir):
    storage_context = StorageContext.from_defaults(persist_dir=persist_dir)

    index = load_index_from_storage(storage_context)

    query_engine = index.as_query_engine(streaming=False, similarity_top_k=4, text_qa_template=text_qa_template)
  else:
    print("model does not exist")
    ctx.res.success= False
    return ctx
  
  response = query_engine.query(query)

  ctx.res.body = f"{response}"

  print(f"Response: \n{response}")

  return ctx

Nitric.run()