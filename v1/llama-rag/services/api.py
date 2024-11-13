import os

from common.model_parameters import embed_model, llm, text_qa_template, persist_dir

from nitric.resources import api
from nitric.context import HttpContext
from nitric.application import Nitric
from llama_index.core import StorageContext, load_index_from_storage, Settings

# Set global settings for llama index
Settings.llm = llm
Settings.embed_model = embed_model

main_api = api("main")

@main_api.post("/prompt")
async def query_model(ctx: HttpContext):
  # Pull the data from the request body
  query = str(ctx.req.data)

  print(f"Querying model: \"{query}\"")

  # Get the model from the stored local context
  if os.path.exists(persist_dir):
    storage_context = StorageContext.from_defaults(persist_dir=persist_dir)

    index = load_index_from_storage(storage_context)

    # Get the query engine from the index, and use the prompt template for santisation.
    query_engine = index.as_query_engine(streaming=False, similarity_top_k=4, text_qa_template=text_qa_template)
  else:
    print("model does not exist")
    ctx.res.success= False
    return ctx

  # Query the model
  response = query_engine.query(query)

  ctx.res.body = f"{response}"

  print(f"Response: \n{response}")

  return ctx

Nitric.run()