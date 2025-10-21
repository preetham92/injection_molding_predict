# Use a lightweight Python base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# --- CRITICAL FIX: Add current directory to Python path for imports ---
ENV PYTHONPATH=/app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory 
COPY backend/ ./backend/

# Expose the port that FastAPI will run on
EXPOSE 8000

# Command to run the application using Uvicorn
# This import string "backend.app" now works because /app is on the PYTHONPATH
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
