# Use the slim image for a much smaller footprint
FROM python:3.10-slim

WORKDIR /app

# Step 1: Copy ONLY the requirements file first
COPY requirements.txt .

# Step 2: Install dependencies 
# (Docker caches this layer unless requirements.txt changes!)
RUN pip install --no-cache-dir -r requirements.txt

# Step 3: Copy the rest of your application code
COPY . .

# Step 4: Start the server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]