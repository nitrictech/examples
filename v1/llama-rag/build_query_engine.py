from common.model_parameters import llm, embed_model, persist_dir

from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Settings

input_dir_path = "..."

Settings.llm = llm
Settings.embed_model = embed_model

# load data
loader = SimpleDirectoryReader(
    input_dir = input_dir_path,
    required_exts=[".mdx"],
    recursive=True
)
docs = loader.load_data()

index = VectorStoreIndex.from_documents(docs, show_progress=True)

index.storage_context.persist(persist_dir)