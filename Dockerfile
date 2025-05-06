# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . .

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]