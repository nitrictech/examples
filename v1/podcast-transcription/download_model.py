from whisper import _MODELS, _download
import argparse
import os

default = os.path.join(os.path.expanduser("~"), ".cache")
download_root = os.path.join(os.getenv("XDG_CACHE_HOME", default), "whisper")

def download_whisper_model(model_name="base"):
    print("downloading model...")
    # have the original download go to the default whisper cache
    model = _download(_MODELS[model_name], root=download_root, in_memory=True)

    # make sure the ./model directory exists
    os.makedirs("./.model", exist_ok=True)

    # write the model to disk
    save_path = f"./.model/model.pt"
    with open(save_path, "wb") as f:
        f.write(model)

    print(f"Model '{model_name}' has been downloaded and saved to './model/model.pt'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download a Whisper model.")
    parser.add_argument("--model_name", type=str, default="base", help="Name of the model to download.")
    
    args = parser.parse_args()
    
    download_whisper_model(model_name=args.model_name)
