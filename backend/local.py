from transformers import pipeline

classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

def convert_star_score(result):
    label = result["label"] 
    return int(label[0])

def test_aspect(text, aspect):
    prompt = f"{aspect}: {text}"
    result = classifier(prompt[:512])[0]
    return convert_star_score(result), result

text = "Nu are frigider, pahare de apă"

for aspect in ["curățenie", "mâncare", "somn", "internet", "facilități"]:
    score, raw = test_aspect(text, aspect)
    print(f"{aspect.capitalize():<15} ➤ Scor: {score}/5   ({raw['label']} - {round(raw['score'] * 100, 2)}%)")
