"""
Test script to verify Hugging Face models can be loaded and work correctly
"""

import sys
from sentence_transformers import SentenceTransformer
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import numpy as np
from sklearn.ensemble import IsolationForest

def test_qna_model():
    """Test the Q&A model from Hugging Face"""
    print("Testing Q&A model...")
    try:
        # Load the model and tokenizer
        tokenizer = T5Tokenizer.from_pretrained('Vedant367/model_qna')
        model = T5ForConditionalGeneration.from_pretrained('Vedant367/model_qna')
        
        # Test question
        question = "How do I replace an iPhone battery?"
        input_text = f"question: {question}"
        
        # Tokenize and generate
        input_ids = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True).input_ids
        
        with torch.no_grad():
            outputs = model.generate(
                input_ids, 
                max_length=512, 
                num_beams=4, 
                no_repeat_ngram_size=2, 
                early_stopping=True
            )
        
        answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print(f"Question: {question}")
        print(f"Answer: {answer}")
        print("✅ Q&A model test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Q&A model test failed: {e}")
        return False

def test_anomaly_model():
    """Test the anomaly detection model from Hugging Face"""
    print("\nTesting anomaly detection model...")
    try:
        # Load the sentence transformer model
        encoder_model = SentenceTransformer('Vedant367/models_anamoly')
        
        # Create isolation forest
        anomaly_detector = IsolationForest(contamination=0.1, random_state=42, n_estimators=100)
        
        # Normal repair steps for training
        normal_steps = [
            "Remove the screws from the back panel",
            "Disconnect the battery connector",
            "Carefully lift the battery out of the device",
            "Insert the new battery into the device",
            "Connect the battery connector",
            "Replace the back panel screws"
        ]
        
        # Generate embeddings
        normal_embeddings = encoder_model.encode(normal_steps)
        
        # Train the model
        anomaly_detector.fit(normal_embeddings)
        
        # Test with normal and anomalous steps
        test_steps = [
            "Remove the display assembly carefully",  # Normal
            "Bake the motherboard in an oven at 400 degrees"  # Anomalous
        ]
        
        for step in test_steps:
            embedding = encoder_model.encode([step])
            score = anomaly_detector.decision_function(embedding)[0]
            prediction = anomaly_detector.predict(embedding)[0]
            is_anomaly = prediction == -1
            
            print(f"Step: {step}")
            print(f"Is Anomaly: {is_anomaly}, Score: {score:.4f}")
        
        print("✅ Anomaly detection model test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Anomaly detection model test failed: {e}")
        return False

def main():
    print("Testing Hugging Face Models Integration")
    print("=" * 50)
    
    qna_success = test_qna_model()
    anomaly_success = test_anomaly_model()
    
    print("\n" + "=" * 50)
    if qna_success and anomaly_success:
        print("✅ All tests passed! The models are working correctly.")
        return 0
    else:
        print("❌ Some tests failed. Please check the error messages above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())