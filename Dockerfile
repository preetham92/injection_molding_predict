# Use a lightweight Python base image
FROM python:3.9-slim

# Set the working directory to the backend folder
WORKDIR /app/backend

# Copy requirements and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy backend directory
COPY backend/ .

# Make sure __init__.py files exist
RUN touch __init__.py src/__init__.py

EXPOSE 8000

# ✅ Run uvicorn from within backend folder
CMD ["uvicorn", "backend.src.app:app", "--host", "0.0.0.0", "--port", "8000", "--app-dir", "/app"]
