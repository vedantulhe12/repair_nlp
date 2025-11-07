# Repair NLP Assistant API

A FastAPI-based application that provides AI-powered repair assistance using Hugging Face models.

## Features

- **Question & Answer**: Ask repair-related questions and get AI-generated answers
- **Anomaly Detection**: Analyze repair steps to detect potentially dangerous or incorrect procedures
- **React Web Interface**: User-friendly web application with multi-language audio support

## Models Used

This application uses the following Hugging Face models:

1. **Q&A Model**: `Vedant367/model_qna` - A T5-based model fine-tuned for repair-related question answering
2. **Anomaly Detection**: `Vedant367/models_anamoly` - A sentence transformer model for detecting anomalous repair steps

## Project Structure

```
├── main.py                 # FastAPI backend server
├── requirements.txt        # Python dependencies
├── test_models.py         # Model testing script
├── my-repair-webapp/      # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AskPage.js     # Q&A interface
│   │   │   ├── DetectPage.js  # Anomaly detection interface
│   │   │   └── HomePage.js    # Landing page
│   │   └── components/
│   │       ├── Header.js      # Navigation header
│   │       ├── Footer.js      # Footer component
│   │       └── AudioPlayer.js # Multi-language audio support
│   └── package.json
└── README.md
```

## Installation & Setup

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Test the models (optional):**
   ```bash
   python test_models.py
   ```

3. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to the React app directory:**
   ```bash
   cd my-repair-webapp
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

The React app will be available at `http://localhost:3000` and will connect to the FastAPI backend at `http://localhost:8000`.

## API Endpoints

### GET /
Health check endpoint that returns the API status.

### POST /ask
Submit a repair-related question and receive an AI-generated answer.

**Request Body:**
```json
{
  "question": "How do I replace an iPhone 12 battery?"
}
```

**Response:**
```json
{
  "answer": "To replace an iPhone 12 battery, you need to..."
}
```

### POST /detect
Analyze a repair step for potential anomalies or dangerous procedures.

**Request Body:**
```json
{
  "step_text": "Heat the device in a microwave for 30 seconds"
}
```

**Response:**
```json
{
  "step_text": "Heat the device in a microwave for 30 seconds",
  "is_anomaly": true,
  "score": -0.8542
}
```

## Model Details

### Q&A Model (Vedant367/model_qna)
- **Architecture**: T5 (Text-To-Text Transfer Transformer)
- **Purpose**: Generate answers to repair-related questions
- **Input Format**: `"question: {your_question}"`
- **Output**: Natural language answer

### Anomaly Detection (Vedant367/models_anamoly)
- **Architecture**: Sentence Transformer (all-MiniLM-L6-v2)
- **Purpose**: Detect anomalous or dangerous repair steps
- **Method**: Uses Isolation Forest trained on normal repair step embeddings
- **Output**: Binary classification (anomaly/normal) with confidence score

## Features

### Multi-language Support
The web interface supports audio instructions in multiple languages:
- English
- Hindi
- French
- German
- Spanish
- Urdu
- Korean
- Chinese
- Japanese

### CORS Configuration
The API is configured to accept requests from the React frontend running on `http://localhost:3000`.

## Development

### Testing Models
Run the test script to verify model functionality:
```bash
python test_models.py
```

### Model Loading
Models are automatically downloaded from Hugging Face Hub on first run and cached locally for faster subsequent startups.

## Deployment

For production deployment, consider:
1. Using a production ASGI server like Gunicorn with Uvicorn workers
2. Setting up proper environment variables for model paths
3. Implementing authentication and rate limiting
4. Using Docker containers for consistent deployment

## Dependencies

- FastAPI
- Transformers (Hugging Face)
- Sentence Transformers
- PyTorch
- Scikit-learn
- React.js
- Axios (for API calls)

## License

This project uses models and code that may be subject to their respective licenses. Please check the individual model pages on Hugging Face for specific licensing information.
