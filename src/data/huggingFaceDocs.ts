export const HUGGINGFACE_DOCUMENTATION = `Below is a code-focused summary that shows how to use Hugging Face tools and workflows. The snippets prioritize practical usage—installing libraries, loading models, handling datasets, training, and deployment—giving an AI agent a clear blueprint for constructing a programming task.

Installation & Setup

# Install core libraries
pip install transformers datasets huggingface_hub

# (Optional) Authenticate with Hugging Face Hub if pushing models/datasets
!huggingface-cli login

Loading Pretrained Models & Tokenizers

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# Load a model and tokenizer from the Model Hub
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased")

# Run inference using a pipeline
classifier = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
print(classifier("I love using Hugging Face tools!"))

Working with the Datasets Library

from datasets import load_dataset

# Load a dataset from the Hub
dataset = load_dataset("imdb")
print(dataset["train"][0])

# Tokenize the dataset
def tokenize_function(example):
    return tokenizer(example["text"], truncation=True, padding="max_length", max_length=128)

tokenized_dataset = dataset.map(tokenize_function, batched=True)

Training & Fine-Tuning with Trainer

from transformers import TrainingArguments, Trainer, DataCollatorWithPadding

# Prepare training data
train_dataset = tokenized_dataset["train"]
eval_dataset = tokenized_dataset["test"]
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# Set up training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=1,
    weight_decay=0.01,
    push_to_hub=False  # Set to True if you want to push final model
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator
)

# Train the model
trainer.train()

# Evaluate the model
metrics = trainer.evaluate()
print(metrics)

Model Upload (Optional)

# Push model to the Hub (requires login and correct permissions)
trainer.push_to_hub()

Creating a Simple Inference Endpoint with Pipeline

# Load pipeline directly from the Hub by model name
sentiment_pipeline = pipeline("sentiment-analysis", model="bert-base-uncased")
result = sentiment_pipeline("This new movie is fantastic!")
print(result)

Building a Demo with Gradio on Hugging Face Spaces

!pip install gradio

import gradio as gr

def classify_sentiment(text):
    return sentiment_pipeline(text)[0]

demo = gr.Interface(fn=classify_sentiment, inputs="text", outputs="label")
demo.launch()

	Note: Once the code is ready, you can create a new Space on Hugging Face Spaces and upload this script to host a live demo.

Additional Tips
	•	Tokenization Control:

# Customize tokenization (e.g., no truncation)
tokenize_function_custom = lambda ex: tokenizer(ex["text"], padding="longest")
tokenized_dataset_custom = dataset.map(tokenize_function_custom, batched=True)


	•	Changing Models/Tasks:

# Switch to a question-answering pipeline
qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")
qa_result = qa_pipeline(question="What is Hugging Face?", context="Hugging Face is a community and platform.")
print(qa_result)


	•	Evaluate with Custom Metrics:

from evaluate import load

accuracy = load("accuracy")
preds = trainer.predict(eval_dataset)
acc_score = accuracy.compute(predictions=preds.predictions.argmax(-1), references=preds.label_ids)
print(acc_score)

This snippet collection provides a code-centric blueprint for an AI agent, guiding it from installation and dataset handling to model training, evaluation, and finally deployment as an interactive demo. It encapsulates the main workflows and features of the Hugging Face ecosystem needed to construct a programming task.

Below is a large collection of additional, code-centric examples and instructions related to Hugging Face’s ecosystem. All information here is new and does not repeat the previously provided snippets. The aim is to further equip an AI agent with a broad set of references for constructing and integrating more advanced programming tasks (e.g., handling different modalities, customizing training, experimenting with various pipelines, and leveraging platform features). These snippets assume that the basic Hugging Face installation and environment setup has already been done.

Advanced Model Loading & Configuration

from transformers import AutoConfig, AutoModelForCausalLM, AutoFeatureExtractor

# Load configuration to inspect or modify model settings before instantiation
config = AutoConfig.from_pretrained("gpt2")
config.n_ctx = 1024  # Adjust context window size if allowed
model = AutoModelForCausalLM.from_config(config)

# For vision tasks, use AutoFeatureExtractor
feature_extractor = AutoFeatureExtractor.from_pretrained("google/vit-base-patch16-224-in21k")

Working with Different Pipeline Tasks

from transformers import pipeline

# Zero-Shot Classification (no pre-training on these labels required)
zero_shot = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print(zero_shot("I love playing basketball on weekends.", candidate_labels=["sports", "cooking", "finance"]))

# Summarization Pipeline
summarizer = pipeline("summarization", model="t5-small")
print(summarizer("Hugging Face provides an integrated platform for machine learning... (long text)"))

# Named Entity Recognition (NER)
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english", grouped_entities=True)
print(ner_pipeline("Apple was founded by Steve Jobs in California."))

# Translation
translator = pipeline("translation_en_to_fr", model="Helsinki-NLP/opus-mt-en-fr")
print(translator("Hugging Face is a community-driven platform for ML practitioners."))

Custom Tokenization & Preprocessing with the Tokenizers Library

from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer

# Train a custom tokenizer on a text file
tokenizer = Tokenizer(BPE())
trainer = BpeTrainer(vocab_size=30000, special_tokens=["[UNK]", "[CLS]", "[SEP]", "[PAD]", "[MASK]"])
tokenizer.train(files=["./data/my_corpus.txt"], trainer=trainer)

encoded = tokenizer.encode("Hello, Hugging Face!")
print(encoded.tokens)

Using datasets with Streaming & Complex Transformations

from datasets import load_dataset

# Stream a large dataset without downloading completely
streamed_dataset = load_dataset("oscar", "unshuffled_deduplicated_en", streaming=True)
for sample in streamed_dataset["train"].take(5):
    print(sample["text"][:100])  # Print the first 100 chars of each sampled text

# Complex transforms: filter by length, shuffle, then select columns
dataset = load_dataset("imdb")
filtered = dataset["train"].filter(lambda x: len(x["text"].split()) > 50)
shuffled = filtered.shuffle(seed=42)
reduced = shuffled.remove_columns(["label"])  # remove the label column to simulate unlabeled data

Advanced Trainer Usage & Callbacks

from transformers import EarlyStoppingCallback

# Add early stopping to a Trainer by specifying callbacks
// Assuming \`trainer\` is defined as before with a model and datasets:
trainer.add_callback(EarlyStoppingCallback(early_stopping_patience=3))

# Run training with early stopping enabled
trainer.train()

# Add custom callbacks or integrate with W&B for logging (no repetition of previous logging)
trainer.log_metrics("train", {"loss": 0.05, "accuracy": 0.99})

Custom Training Loops with Accelerate

from accelerate import Accelerator
import torch

# Custom training loop with Accelerate for distributed training
accelerator = Accelerator()
model, optimizer, train_dataloader = accelerator.prepare(model, trainer.optimizer, trainer.get_train_dataloader())

model.train()
for epoch in range(3):
    for batch in train_dataloader:
        outputs = model(**batch)
        loss = outputs.loss
        accelerator.backward(loss)
        optimizer.step()
        optimizer.zero_grad()

Working with Audio and Multimodal Models

from transformers import Wav2Vec2ForCTC, AutoProcessor
import soundfile as sf

# Load an audio-based model for speech recognition
processor = AutoProcessor.from_pretrained("facebook/wav2vec2-base-960h")
audio_model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

# Process raw audio
speech, sr = sf.read("sample.wav")
input_values = processor(speech, sampling_rate=sr, return_tensors="pt").input_values
logits = audio_model(input_values).logits
pred_ids = torch.argmax(logits, dim=-1)
transcription = processor.batch_decode(pred_ids)[0]
print(transcription)

Fine-Tuning Vision Models

from transformers import AutoModelForImageClassification

# Load and fine-tune a vision transformer on a custom image dataset
image_model = AutoModelForImageClassification.from_pretrained("google/vit-base-patch16-224")

// Suppose you have \`image_dataset\` already loaded and processed
// Convert dataset samples to pixel values via feature_extractor
def preprocess_images(examples):
    inputs = feature_extractor([img for img in examples["image"]], return_tensors="pt")
    inputs["labels"] = examples["label"]
    return inputs

processed_image_dataset = image_dataset.map(preprocess_images, batched=True)

Using huggingface_hub for Repository Management

from huggingface_hub import create_repo, HfApi, upload_file

# Create a new repository on the Hub (requires authentication)
repo_url = create_repo(name="my-new-model-repo", private=True)

# Upload additional files to the repository
api = HfApi()
api.upload_file(
    path_or_fileobj="./my_model_directory/config.json",
    path_in_repo="config.json",
    repo_id="username/my-new-model-repo"
)

Caching & Local Storage Control

import os
from huggingface_hub import hf_hub_download

# Download a model file from a hub repo to a local cache
local_model_file = hf_hub_download(repo_id="bert-base-uncased", filename="pytorch_model.bin")
print(f"Model file downloaded at: {local_model_file}")

# Control Transformers cache directory
os.environ["HF_HOME"] = "./my_hf_cache"

Custom Loss Functions and Metrics Integration

import evaluate
import torch.nn.functional as F

metric = evaluate.load("f1")

def compute_metrics(eval_preds):
    logits, labels = eval_preds
    preds = logits.argmax(-1)
    return metric.compute(predictions=preds, references=labels)

# Custom loss within a custom training step
def custom_training_step(model, batch):
    outputs = model(**batch)
    loss = outputs.loss
    # Example: Add auxiliary loss or any custom logic
    loss = loss + torch.mean(F.softmax(outputs.logits, dim=-1)) * 0.01
    return loss

Model Cards and Metadata

# Create a model card in the repository directory
model_card_content = """
# My Fine-Tuned Model

This model is a fine-tuned version of \`bert-base-uncased\` on the IMDB dataset.

- **Languages:** English
- **Task:** Sentiment Analysis
- **Performance:** ~95% accuracy on test data
- **Intended Use:** Sentiment classification of movie reviews
- **Limitations and Biases:** May not generalize well to other domains
"""

with open("./my_model_directory/README.md", "w") as f:
    f.write(model_card_content)

Using AutoProcessor for Vision-Language Tasks

from transformers import AutoProcessor, VisionEncoderDecoderModel

# Load a model that combines vision and text (image captioning)
processor = AutoProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
vl_model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

# Process an image and generate a caption
inputs = processor(images="my_image.jpg", return_tensors="pt")
pixel_values = inputs.pixel_values
generated_ids = vl_model.generate(pixel_values)
caption = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
print(caption)

Multi-Lingual and Cross-Lingual Capabilities

# Using a multilingual model for NER in multiple languages
multilingual_ner = pipeline("ner", model="Davlan/xlm-roberta-base-ner-hrl")
print(multilingual_ner("Barack Obama was the 44th president of the United States."))  
print(multilingual_ner("Emmanuel Macron est le président de la France."))

Handling Private Models & Organizations

# Access a private model after logging in with a personal access token
private_model_name = "my-org/private-model"
private_model = AutoModelForSequenceClassification.from_pretrained(private_model_name, use_auth_token=True)

Hardware Acceleration and GPU Selection

import torch

# Set device if GPU is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Using pipeline with GPU
summarizer_gpu = pipeline("summarization", model="t5-small", device=0 if torch.cuda.is_available() else -1)

Performance Optimization: Quantization & Distillation

from transformers import DistilBertForSequenceClassification, AutoModelForSequenceClassification

# Distillation example: use a teacher model and distill into a student model
teacher_model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased")
student_model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased")

# Further steps: train student on teacher outputs or intermediate features (not fully shown)
# Example: quantization for inference speed-up (PyTorch)
student_model.quantize()

Additional Utilities

# Convert dataset to torch format
torch_dataset = tokenized_dataset.with_format("torch", columns=["input_ids", "attention_mask", "labels"])

# Use \`transformers-cli\` for model management
!transformers-cli env  # Show environment info
# More commands: transformers-cli ls, transformers-cli login, etc.

This extended set of code snippets and instructions covers new topics such as advanced configuration, various pipeline tasks (NER, translation, summarization, zero-shot), custom tokenizers, dataset streaming and transformations, callbacks, accelerate-based custom loops, audio and vision tasks, repository management via huggingface_hub, caching, custom losses and metrics, model cards, vision-language processing, multilingual capabilities, private model access, GPU acceleration, distillation, quantization, and command-line utilities. Together, these provide a broad foundation for an AI agent to construct and orchestrate a diverse range of programming tasks using Hugging Face’s tools and ecosystem, without repeating previously given information.`;
