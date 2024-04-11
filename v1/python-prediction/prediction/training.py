import pickle
import numpy as np

from keras.utils import to_categorical, pad_sequences
from keras.models import Sequential
from keras.layers import LSTM, Dense, Embedding, Bidirectional
from keras.optimizers import Adam
from keras.callbacks import ModelCheckpoint, ReduceLROnPlateau

from sklearn.model_selection import train_test_split

np.random.seed(100)

# Load tokenizer
with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)


# Create the input sequences of all n_grams in the data
def create_input_sequences(data: list[str], n_gram_size=6):
    # Create n-gram input sequences based on an n-gram size of 6
    input_sequences = []
    token_list = tokenizer.texts_to_sequences([data])[0]

    # Sliding iteration which takes every 6 words in a row as an input sequence
    for i in range(1, len(token_list) - n_gram_size):
        n_gram_sequence = token_list[i:i + n_gram_size]
        input_sequences.append(n_gram_sequence)

    max_sequence_len = max([len(x) for x in input_sequences])

    return np.array(pad_sequences(input_sequences, maxlen=max_sequence_len, padding='pre')), max_sequence_len


# Create the features and labels and split the data into training and testing
def create_training_data(input_sequences):
    # Create features and labels
    xs, labels = input_sequences[:, :-1], input_sequences[:, -1]
    ys = to_categorical(labels, num_classes=total_words)

    # Split data
    return train_test_split(xs, ys, test_size=0.1, shuffle=True)


# Train the model
def train_model(X_train, y_train, total_words, max_sequence_len):
    # Create callbacks
    bilstm_checkpoint = ModelCheckpoint(
        "model.keras",
        monitor='loss',
        save_best_only=True,
        mode='auto'
    )

    bilstm_reduce = ReduceLROnPlateau(monitor='loss', factor=0.2, patience=3, min_lr=0.0001, verbose=1)

    # Create optimiser
    bilstm_adam = Adam(learning_rate=0.01)

    # Create model
    bilstm_model = Sequential()
    bilstm_model.add(Embedding(total_words, 100, input_length=max_sequence_len - 1))
    bilstm_model.add(Bidirectional(LSTM(512)))
    bilstm_model.add(Dense(total_words, activation='softmax'))

    bilstm_model.summary()

    # Compile model
    bilstm_model.compile(loss='categorical_crossentropy', optimizer=bilstm_adam, metrics=['accuracy'])
    bilstm_model.fit(
        X_train, y_train, epochs=20, batch_size=2000,
        callbacks=[
            bilstm_checkpoint,
            bilstm_reduce,
        ]
    )


data = open('clean_data.txt', 'r').read().split(' ')
total_words = len(tokenizer.word_index) + 1

input_sequences, max_sequence_len = create_input_sequences(data)
X_train, X_test, y_train, y_test = create_training_data(input_sequences)

train_model(X_train, y_train, total_words, max_sequence_len)
