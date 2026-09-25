FROM python:3.12-slim

WORKDIR /app

# Dependencies first, so code changes reuse the cached install
COPY requirements.txt .
RUN pip install --no-cache-dir --root-user-action=ignore -r requirements.txt

COPY database.py ingestor.py ./

RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser

# Loads the data once and exits
CMD ["python", "ingestor.py"]
