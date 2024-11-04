from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("tarudesu/ViHateT5-base-HSD")
model = AutoModelForSeq2SeqLM.from_pretrained("tarudesu/ViHateT5-base-HSD")
prefix = ['hate-speech-detection', 'toxic-speech-detection', 'hate-spans-detection'][2]


def generate_output(input_text, prefix=prefix):
    # Add prefix
    prefixed_input_text = prefix + ': ' + input_text

    # Tokenize input text
    input_ids = tokenizer.encode(prefixed_input_text, return_tensors="pt")

    # Generate output
    output_ids = model.generate(input_ids, max_length=256)

    # Decode the generated output
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    return output_text
