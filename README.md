# 🏭 Manufacturing Output Predictor: ML-Powered API

## 💡 Project Overview

The **Manufacturing Output Predictor** is a fully containerized, end-to-end data science application designed to **optimize and diagnose** injection molding machine performance.

The system uses a **Linear Regression Model** to predict the hourly throughput (Parts\_Per\_Hour) based on 17 operational parameters (e.g., temperature, cycle time, material viscosity).

The primary value is establishing a **performance baseline** and automatically detecting machines that are underperforming relative to their optimal settings.

## ⚙️ Architecture & Deployment

The application is structured as a decoupled, three-tier microservice architecture, allowing for independent scaling and maintenance of the client and API.

| Component | Technology | Live URL | Hosting |
| --- | --- | --- | --- |
| Frontend UI | React/Vite, TypeScript, Tailwind | https://injection-molding-predict-x9sw-815x68p07-preetham92s-projects.vercel.app | Vercel |
| Backend API | FastAPI, Docker, Uvicorn | https://manufacturing-output-api.onrender.com | Render (Free Tier) |

## 📦 Model Details & Performance

The core logic is contained within a Scikit-learn pipeline saved to disk, ensuring consistency between training and deployment environments.

| Metric | Value | Interpretation |
| --- | --- | --- |
| Model Type | Linear Regression | Simple, fast, and highly interpretable model chosen for production speed. |
| Input Features | 17 (Numerical & Categorical) | Includes Injection_Temperature, Cycle_Time, Material_Grade, etc. |
| Root Mean Squared Error (RMSE) | ~3.51 | On average, the model's prediction is off by 3.51 parts per hour. This is considered highly accurate for industrial output prediction. |
| Pre-processing | Custom Pipeline | Handles imputation, StandardScaler for numerics, and OneHotEncoder (with sparse output) for categoricals. |

## 🚀 Setup & Local Running

The project requires both Python/Docker and Node/npm to run locally.

### 1\. Backend Setup (API and Model)

1.  **Install Python Dependencies:** Navigate to the project root and install the requirements:  
    pip install -r requirements.txt  
    
2.  **Run Model Training:** Execute the script to generate and save the model artifacts (.pkl files) into the backend/models/ folder.  
    python src/train\_model.py  
    
3.  **Start FastAPI Server (for local testing):**  
    \# Runs the API on the standard container port (8000) for cross-origin testing.  
    uvicorn backend.src.app:app --host 0.0.0.0 --port 8000  
    

### 2\. Frontend Setup (UI)

1.  **Navigate to Frontend:**  
    cd frontend/injection\_molding\_predictor  
    
2.  **Install Node Dependencies:**  
    npm install  
    
3.  **Run the Frontend:** The development server usually starts on http://localhost:3000.  
    npm run dev  
    

_(Note: For local testing, you must temporarily change the API\_ENDPOINT in the frontend source code back to a local address (e.g., http://127.0.0.1:8000/predict) before running npm run dev.)_
