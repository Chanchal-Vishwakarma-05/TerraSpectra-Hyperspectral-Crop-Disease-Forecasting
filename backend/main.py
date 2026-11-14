from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TerraSpectra Backend",
    description="Hyperspectral Crop Disease Forecasting API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {
        "project": "TerraSpectra",
        "message": "Backend is running successfully!"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}