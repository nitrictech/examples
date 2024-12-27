import pickle
import numpy as np

from keras.models import load_model
from keras.utils import pad_sequences

from nitric.resources import api
from nitric.application import Nitric

mainApi = api("main")

model = None
tokenizer = None


def load_tokenizer():
    global tokenizer
    print("getting tokenizer...")
    if tokenizer is None:
        print("tokenizer does not exist. loading tokenizer...")
        # Load the tokenizer
        with open('tokenizer.pickle', 'rb') as handle:
            tokenizer = pickle.load(handle)
        print("loaded tokenizer...")
    return tokenizer


def load_prediction_model():
    global model
    print("getting model...")
    if model is None:
        print("model does not exist. loading model...")
        # Load the model
        model = load_model('model.keras')
        print("loaded model...")
    return model


# Predict text based on a set of seed text
# Returns a list of 3 top choices for the next word 
def predict_text(seed_text: str) -> list[str]:
    # Convert the seed text into a token list using the same process as the previous tokenization
    load_tokenizer()
    token_list = tokenizer.texts_to_sequences([seed_text])[0]

    token_list = pad_sequences([token_list], maxlen=5, padding='pre')

    # Make the prediction
    m = load_prediction_model()

    print("making prediction...")
    predict_x = m.predict(token_list, batch_size=500, verbose=0)

    # Find the top three words
    predict_x = np.argpartition(predict_x, -3, axis=1)[0][-3:]

    # Reverse the list so the most popular is first
    predictions = list(predict_x)
    predictions.reverse()

    # Iterate over the predicted words, and find the word in the tokenizer dictionary that matches
    output_words = []
    for prediction in predictions:   
        for word, index in tokenizer.word_index.items():
            if prediction == index:
                output_words.append(word)
                break

    return output_words


@mainApi.get("/prediction")
async def hello_world(ctx):
    prompt = ctx.req.query.get("prompt")

    if prompt is None:
        ctx.res.status = 400
        ctx.res.body = "empty query parameter 'prompt' supplied"
        return ctx

    prompt = " ".join(prompt)

    print(f"received prompt: '{prompt}'")

    prediction = predict_text(prompt)

    ctx.res.body = f"{prompt} {prediction}"

Nitric.run()
