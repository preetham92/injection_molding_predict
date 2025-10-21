import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware

# --- Initialize the FastAPI app FIRST ---
app = FastAPI(
    title="Manufacturing Output Prediction API",
    description="A simple API to predict hourly output of injection molding machines."
)

# --- CORS Configuration ---
origins = ["*", "http://localhost:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Define File Paths ---
MODEL_DIR = 'models'
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, 'preprocessor.pkl')
MODEL_PATH = os.path.join(MODEL_DIR, 'linear_regression_model.pkl')

# --- Load the trained model and preprocessor ---
print("Attempting to load model artifacts...")
try:
    model = joblib.load(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    print("Model and preprocessor loaded successfully.")
except FileNotFoundError:
    print(f"Error: Could not find artifacts.")
    print(f"Expected model at: {MODEL_PATH}")
    print(f"Expected preprocessor at: {PREPROCESSOR_PATH}")
    exit()

# --- Define Pydantic model ---
class MachineParameters(BaseModel):
    Injection_Temperature: float
    Injection_Pressure: float
    Cycle_Time: float
    Cooling_Time: float
    Material_Viscosity: float
    Ambient_Temperature: float
    Machine_Age: float
    Operator_Experience: float
    Maintenance_Hours: float
    Shift: str
    Machine_Type: str
    Material_Grade: str
    Day_of_Week: str
    Temperature_Pressure_Ratio: float
    Total_Cycle_Time: float
    Efficiency_Score: float
    Machine_Utilization: float

# --- Prediction endpoint ---
@app.post("/predict")
def predict_output(params: MachineParameters):
    input_data = pd.DataFrame([params.dict()])
    try:
        processed_data = preprocessor.transform(input_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Data preprocessing failed: {e}")
    prediction = model.predict(processed_data)
    return {"predicted_parts_per_hour": round(prediction[0], 2)}

# --- Root endpoint ---
@app.get("/")
def read_root():
    return {"message": "Manufacturing Output Prediction API is running."}
