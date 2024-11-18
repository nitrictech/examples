from llama_index.core import ChatPromptTemplate
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.llama_cpp import LlamaCPP


# Load the locally stored Llama model
llm = LlamaCPP(
  model_url=None,
  model_path="./model/Llama-3.2-1B-Instruct-Q4_K_M.gguf",
  temperature=0.7,
  verbose=False,
)

# Load the embed model from hugging face
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-large-en-v1.5", trust_remote_code=True)

# Set the location that we will persist our embeds
persist_dir = "query_engine_vectors"

# Create the prompt query templates to sanitise hallucinations
text_qa_template = ChatPromptTemplate.from_messages([
  (
    "system",
    "If the context is not useful, respond with 'I'm not sure'.",
  ),
  (
    "user",
    (
      "Context information is below.\n"
      "---------------------\n"
      "{context_str}\n"
      "---------------------\n"
      "Given the context information and not prior knowledge "
      "answer the question: {query_str}\n."
    )
  ),
])