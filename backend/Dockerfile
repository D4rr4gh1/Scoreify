# Dockerfile
FROM python:3.13.2

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


COPY . .

EXPOSE 8000
