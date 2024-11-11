from llama_index.core import Settings, ChatPromptTemplate
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.llama_cpp import LlamaCPP


# Load the locally stored Llama model or change to use model_url parameter
# cd models
# curl -OL https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf
llm = LlamaCPP(
    model_url=None, 
    model_path="./models/Llama-3.2-1B-Instruct-Q4_K_M.gguf",         
    temperature=0.7,
    verbose=False,
)

embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-large-en-v1.5", trust_remote_code=True)


qa_prompt_str = (
    "Context information is below.\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "Given the context information and not prior knowledge "
    "answer the question: {query_str}\n."
)

chat_text_qa_msgs = [
    (
        "system",
        "If the context is not useful, respond with 'I'm not sure'.",
    ),
    ("user", qa_prompt_str),
]

text_qa_template = ChatPromptTemplate.from_messages(chat_text_qa_msgs)