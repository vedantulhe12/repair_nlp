# Quick Start Guide

## 🚀 Updated Implementation with Hugging Face Models

Your application has been successfully updated to use the Hugging Face models:
- **Q&A Model**: `Vedant367/model_qna`
- **Anomaly Detection**: `Vedant367/models_anamoly`

## 📁 What Changed

### 1. Backend (main.py)
- ✅ Removed local model file dependencies (no more models.zip)
- ✅ Added direct Hugging Face model loading
- ✅ Implemented Isolation Forest for anomaly detection
- ✅ Enhanced error handling and robustness
- ✅ Models are downloaded automatically on first run

### 2. Dependencies (requirements.txt)
- ✅ Added `numpy` and `huggingface-hub`
- ✅ All existing dependencies maintained

### 3. Frontend (React App)
- ✅ No changes needed - existing API calls work seamlessly
- ✅ All existing features preserved

## 🎯 How to Run

### Option 1: Using Batch Files (Windows)

1. **Start the API Server:**
   ```bash
   start_api.bat
   ```

2. **Start the Web App (in a new terminal):**
   ```bash
   start_webapp.bat
   ```

### Option 2: Manual Commands

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Test models (optional):**
   ```bash
   python test_models.py
   ```

3. **Start API server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Start React app (in new terminal):**
   ```bash
   cd my-repair-webapp
   npm install
   npm start
   ```

## 🔧 Model Loading Process

### First Run
- Models will be downloaded from Hugging Face Hub automatically
- This may take a few minutes depending on your internet connection
- Models are cached locally for faster subsequent starts

### Model Sizes
- Q&A Model: ~77M parameters
- Anomaly Detection Model: ~22.7M parameters

## 🌐 Access Points

- **API Server**: http://localhost:8000
- **Web Application**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

## ✨ New Features

### Enhanced Anomaly Detection
- Uses pre-trained sentence transformers from Hugging Face
- Improved accuracy with Isolation Forest algorithm
- Better handling of repair step analysis

### Robust Error Handling
- Graceful degradation when models are loading
- Better error messages for users
- Comprehensive logging for debugging

### No Local Model Files
- No need for models.zip or local model directories
- Everything is downloaded from Hugging Face automatically
- Easier deployment and version management

## 🧪 Testing

Run the test script to verify everything is working:
```bash
python test_models.py
```

This will test both the Q&A and anomaly detection models with sample data.

## 🔍 API Changes

### Endpoints (Same as before)
- `GET /` - Health check
- `POST /ask` - Ask repair questions
- `POST /detect` - Detect step anomalies

### Response Format (Unchanged)
All API responses maintain the same format, so your React app works without modifications.

## 🚨 Troubleshooting

### Common Issues
1. **Models not loading**: Check internet connection for Hugging Face downloads
2. **Memory issues**: The models require ~4GB RAM total
3. **CORS errors**: Make sure both servers are running on correct ports

### Performance Tips
- First model loading takes time - be patient
- Subsequent runs are much faster (models cached)
- Consider using GPU if available for better performance

## 📋 Next Steps

1. Run `python test_models.py` to verify model functionality
2. Start the API server with `start_api.bat`
3. Start the web app with `start_webapp.bat`
4. Test the application at http://localhost:3000

Your repair assistant is now powered by state-of-the-art Hugging Face models! 🎉