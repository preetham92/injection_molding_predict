# train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import joblib
import os # Necessary for correct cross-platform file path construction

# --- Define Project File Paths Relative to the Project Root ---
MODEL_DIR = 'models'
DATA_PATH = 'data/manufacturing_dataset_1000_samples.csv'

# Artifact paths are constructed relative to the root directory where the script is run
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, 'preprocessor.pkl') 
MODEL_SAVE_PATH = os.path.join(MODEL_DIR, 'linear_regression_model.pkl')


# 1. Load data and preprocessor
print("Loading data and preprocessor...")
try:
    # Load raw data
    df = pd.read_csv(DATA_PATH)
    
    # Load the trained preprocessor (Scaler and OneHotEncoder) from the dedicated 'models' folder
    preprocessor = joblib.load(PREPROCESSOR_PATH) 
    print("Data and preprocessor loaded successfully.")

except FileNotFoundError:
    print(f"Error: A required file was not found.")
    print(f"Expected to find raw data at '{DATA_PATH}' and preprocessor at '{PREPROCESSOR_PATH}'.")
    print("Please ensure you have run 'eda_preprocessing.ipynb' AND copied 'preprocessor.pkl' into the 'models/' folder.")
    exit()

# Define features and target variable
target_col = 'Parts_Per_Hour'

# CRITICAL: Drop the 'Timestamp' column to ensure consistency with preprocessing fit
columns_to_drop = ['Timestamp']
if 'Timestamp' in df.columns:
    df.drop(columns=['Timestamp'], inplace=True)

X = df.drop(columns=target_col, errors='ignore')
y = df[target_col]

# 2. Apply preprocessing
print("\nApplying preprocessing to the dataset (Scaling, Imputation, Encoding)...")
# X_processed will be a NumPy array or sparse matrix, ready for the model
X_processed = preprocessor.transform(X)
print("Preprocessing complete.")

# 3. Split the data into training and testing sets (80-20 split)
print("\nSplitting data into training and testing sets...")
X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)
print(f"Training set size: {X_train.shape[0]} samples")
print(f"Testing set size: {X_test.shape[0]} samples")

# 4. Train the Linear Regression model
print("\nTraining the Linear Regression model...")
model = LinearRegression()
model.fit(X_train, y_train)
print("Model training complete.")

# 5. Evaluate the model on the test set
print("\nEvaluating the model...")
y_pred = model.predict(X_test)

# Calculate Mean Squared Error (MSE)
mse = mean_squared_error(y_test, y_pred)
# Calculate Root Mean Squared Error (RMSE)
rmse = np.sqrt(mse)

print(f"\nModel Performance Metrics on the Test Set:")
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")

# 6. Save the trained model to the correct file path
joblib.dump(model, MODEL_SAVE_PATH)
print(f"\nTrained model saved as '{MODEL_SAVE_PATH}'.")