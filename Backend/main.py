# backend/main.py
import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional

# -------------------------
# Config
# -------------------------
MODEL_PATH = os.getenv("MODEL_PATH", "model/crop_model.joblib")

app = FastAPI(title="Crop Recommender", version="1.0.0")

# ✅ CORS (frontend <-> backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for dev; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Load Model
# -------------------------
MODEL = None

@app.on_event("startup")
def load_model():
    global MODEL
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Model not found at {MODEL_PATH}")
    MODEL = joblib.load(MODEL_PATH)


# -------------------------
# Request / Response Models
# -------------------------
class PredictRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class PredictResponse(BaseModel):
    prediction: str
    confidence: Optional[float] = None


# -------------------------
# Endpoints
# -------------------------
@app.get("/")
def root():
    return {"message": "Crop Recommendation API is running!"}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if MODEL is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Put features into DataFrame
    data = pd.DataFrame([{
        "N": req.N,
        "P": req.P,
        "K": req.K,
        "temperature": req.temperature,
        "humidity": req.humidity,
        "ph": req.ph,
        "rainfall": req.rainfall,
    }])

    try:
        pred = MODEL.predict(data)[0]
        confidence = None
        if hasattr(MODEL, "predict_proba"):
            probs = MODEL.predict_proba(data)[0]
            confidence = round(max(probs) * 100, 2)  # % confidence
        return PredictResponse(prediction=str(pred), confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


# -------------------------
# Run with Uvicorn
# -------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
