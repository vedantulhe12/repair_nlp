import os
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
from contextlib import asynccontextmanager
from sklearn.ensemble import IsolationForest

# =================================================================
# ==> THIS IS THE FIX. WE ARE IMPORTING THE CORS MIDDLEWARE
# =================================================================
from fastapi.middleware.cors import CORSMiddleware
# =================================================================

# --- 1. SET UP A GLOBAL "STATE" TO HOLD OUR MODELS ---
models = {}

# --- 2. THE "LIFESPAN" EVENT (Loads models from Hugging Face) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading models from Hugging Face...")
    try:
        # Load Q&A model from Hugging Face
        print("Loading Q&A model from Hugging Face...")
        models['qna_tokenizer'] = T5Tokenizer.from_pretrained('Vedant367/model_qna')
        models['qna_model'] = T5ForConditionalGeneration.from_pretrained('Vedant367/model_qna')
        
        # Load anomaly detection model from Hugging Face
        print("Loading anomaly detection model from Hugging Face...")
        models['encoder_model'] = SentenceTransformer('Vedant367/models_anamoly')
        
        # Create a simple anomaly detector using Isolation Forest
        # This will be trained on-the-fly with normal repair steps
        models['anomaly_detector_model'] = IsolationForest(
            contamination=0.1,  # Assume 10% of data points are anomalies
            random_state=42,
            n_estimators=100
        )
        
        # Pre-train the anomaly detector with some normal repair step embeddings
        print("Pre-training anomaly detector with normal repair steps...")
        normal_repair_steps = [
            "Remove the screws from the back panel",
            "Disconnect the battery connector",
            "Carefully lift the battery out of the device",
            "Insert the new battery into the device",
            "Connect the battery connector",
            "Replace the back panel screws",
            "Power on the device to test",
            "Check all connections are secure",
            "Ensure proper alignment of components",
            "Use appropriate tools for disassembly"
        ]
        
        # Generate embeddings for normal steps
        normal_embeddings = models['encoder_model'].encode(normal_repair_steps)
        
        # Fit the isolation forest with normal data
        models['anomaly_detector_model'].fit(normal_embeddings)
        
        print("✅✅✅ All models loaded successfully from Hugging Face!")
    except Exception as e:
        print(f"❌ ERROR: Failed to load models. {e}")
    
    yield
    models.clear()

# --- 3. INITIALIZE FASTAPI ---
app = FastAPI(
    title="Repair NLP Assistant API",
    lifespan=lifespan
)

# =================================================================
# ==> THIS IS THE FIX. WE ARE TELLING THE API TO TRUST YOUR APP
# =================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # This is your React app's address
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET)
    allow_headers=["*"],  # Allow all headers
)
# =================================================================

# ... (The rest of your API code is the same) ...

class QARequest(BaseModel):
    question: str
class QAResponse(BaseModel):
    answer: str
class AnomalyRequest(BaseModel):
    step_text: str
class AnomalyResponse(BaseModel):
    step_text: str
    is_anomaly: bool
    score: float

@app.get("/", summary="Root endpoint for health check")
def read_root():
    if 'qna_model' in models:
        return {"status": "API is online and models are loaded!"}
    return {"status": "API is online, but models are still loading..."}

@app.post("/ask", response_model=QAResponse)
def ask_question(request: QARequest):
    if 'qna_model' not in models or 'qna_tokenizer' not in models:
        return QAResponse(answer="Error: The AI model is still loading. Please wait a moment and try again.")
    
    try:
        # Format the input for the T5 model
        input_text = f"question: {request.question}"
        input_ids = models['qna_tokenizer'](
            input_text, 
            return_tensors="pt", 
            max_length=512, 
            truncation=True,
            padding=True
        ).input_ids
        
        # Generate the answer
        with torch.no_grad():
            outputs = models['qna_model'].generate(
                input_ids, 
                max_length=512, 
                num_beams=4, 
                no_repeat_ngram_size=2, 
                early_stopping=True,
                do_sample=False
            )
        
        # Decode the answer
        answer = models['qna_tokenizer'].decode(outputs[0], skip_special_tokens=True)
        
        # Clean up the answer (remove any residual formatting)
        if answer.startswith("question:"):
            answer = answer.replace("question:", "").strip()
        
        return QAResponse(answer=answer)
    
    except Exception as e:
        print(f"Error in Q&A generation: {e}")
        return QAResponse(answer=f"Error: Unable to generate answer. Please try rephrasing your question. ({str(e)})")

@app.post("/detect", response_model=AnomalyResponse)
def detect_anomaly(request: AnomalyRequest):
    if 'encoder_model' not in models or 'anomaly_detector_model' not in models:
        return AnomalyResponse(
            step_text=request.step_text,
            is_anomaly=False,
            score=0.0
        )

    try:
        # Generate embedding for the input text
        embedding = models['encoder_model'].encode([request.step_text])
        
        # Get anomaly score and prediction
        score = models['anomaly_detector_model'].decision_function(embedding)[0]
        prediction = models['anomaly_detector_model'].predict(embedding)[0]
        is_anomaly = True if prediction == -1 else False
        
        return AnomalyResponse(
            step_text=request.step_text,
            is_anomaly=is_anomaly,
            score=float(score)
        )
    except Exception as e:
        print(f"Error in anomaly detection: {e}")
        return AnomalyResponse(
            step_text=request.step_text,
            is_anomaly=False,
            score=0.0
        )