FROM python:3.9

# Set the working directory
WORKDIR /code

# Copy the requirements file
COPY ./requirements.txt /code/requirements.txt

# Install the dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application code
COPY ./app /code/app

# The port must be 7860 for Hugging Face Spaces
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
