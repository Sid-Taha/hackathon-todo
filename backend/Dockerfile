# backend/Dockerfile

# Python 3.13 image use kar rahe hain (Project requirement)
FROM python:3.13-slim

# Working directory set karein
WORKDIR /app

# System dependencies install karein (PostgreSQL ke liye)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Dependencies file copy karein
COPY pyproject.toml .

# uv package manager install karein (Fast installation ke liye)
RUN pip install uv

# Dependencies install karein
RUN uv pip install --system "fastapi" "uvicorn" "sqlmodel" "psycopg2-binary" "python-jose[cryptography]" "python-multipart" "alembic" "pydantic-settings"

# Pura backend code copy karein
COPY . .

# Port expose karein
EXPOSE 8000

# App run karein
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]