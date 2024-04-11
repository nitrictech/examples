import string
import pickle
import re

from keras.preprocessing.text import Tokenizer
from num2words import num2words


# Remove the section headers
def remove_section_headers(lines: list[str]):
  section = False
  new_lines = []
  for line in lines:
    if line.lower().startswith(("end of the second", "end of vol")):
      section = True
    elif line.lower().startswith("chapter") and section:
      section = False

    if not section:
      new_lines.append(line)
  return new_lines


def remove_chapters(data: str):
  return str(re.sub('(CHAPTER .+)', '', data))

def remove_contractions(data: str) -> str:
  return (data.
    replace("shan't", "shall not").
    replace("here's", "here is").
    replace("you'll", "you will").
    replace("what's", "what is").
    replace("don't", "do not").
    replace("i'm", "i am").
    replace("there's", "there is")
  )

def remove_punctuation(data: str) -> str:
  return data.translate(str.maketrans(string.punctuation, ' ' * len(string.punctuation)))

def convert_numbers(data: str) -> str:
  numberless_data = []
  for word in data.split():
    if str.isdigit(word):
      numberless_data.append(num2words(word))
    else:
      numberless_data.append(word)
  return " ".join(numberless_data)

# Open text data and read it into array
file = open("data.txt", "r")
lines = []

for line in file:
  lines.append(line)

data = remove_section_headers(lines)
data = remove_chapters(" ".join(data))
data = data.lower()
data = remove_contractions(data)
data = remove_punctuation(data)
data = convert_numbers(data)

# Save the cleaned data in a new file
with open('clean_data.txt', 'w') as f:
    f.write(data)

# Tokenize the data and fit it to the text
tokenizer = Tokenizer(oov_token='<oov>')  # For those words which are not found in word_index
tokenizer.fit_on_texts(data.split())

# Save tokenizer
with open('tokenizer.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

