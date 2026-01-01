# ai-agent\Dockerfile
FROM python:3.13-slim

# Root folder mein rahenge
WORKDIR /app

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .
RUN pip install uv
RUN uv pip install --system "fastapi" "uvicorn" "httpx" "python-dotenv" "openai-agents" "openai-agents-mcp" "mcp"

# Code copy
COPY ai-agent/ ./ai-agent/
COPY mcp-server/ ./mcp-server/

EXPOSE 8001

# ✅ FIX: Python ko batana ke 'ai-agent' folder kahan hai
ENV PYTHONPATH=/app:/app/ai-agent

# Command
CMD ["uvicorn", "ai-agent.main:app", "--host", "0.0.0.0", "--port", "8001"]