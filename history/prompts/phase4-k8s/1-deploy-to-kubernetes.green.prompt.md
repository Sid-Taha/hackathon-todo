<!-- history\prompts\phase4-k8s\1-deploy-to-kubernetes.green.prompt.md -->
---
id: 1
title: Deploy Full Stack App to Kubernetes (Minikube)
stage: green
date: 2026-01-01
surface: chat
model: gemini-2.0-flash-thinking-exp
feature: phase4-k8s
branch: main
user: PMLS
command: kubectl apply -f k8s/
labels: ["kubernetes", "minikube", "docker", "deployment", "troubleshooting"]
links:
  spec: specs/phase3-ai-agent/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - k8s/secrets.yaml
 - k8s/backend.yaml
 - k8s/frontend.yaml
 - k8s/agent.yaml
 - ai-agent/Dockerfile
 - ai-agent/agent.py
 - mcp-server/main.py
tests:
 - kubectl get pods
 - Browser E2E Test
---

## Prompt

I need to deploy the Phase 3 application (Frontend, Backend, AI Agent) to a local Kubernetes cluster using Minikube.
Please guide me through creating the necessary YAML files for deployment.
Constraints:
1. Use the existing NeonDB (Cloud) for the database.
2. Ensure the AI Agent can communicate with the Backend within the cluster.
3. Fix any Docker/Python path issues that arise during the containerization of the AI Agent.

## Response snapshot

I have successfully deployed the application to Kubernetes.

**Steps Executed:**
1.  **Secrets Management:** Created `k8s/secrets.yaml` to store `DATABASE_URL` and `OPENAI_API_KEY`.
2.  **Deployments:** Created `backend.yaml`, `frontend.yaml`, and `agent.yaml` for respective services.
3.  **Docker Build & Fixes:**
    - Updated `ai-agent/Dockerfile` to set `PYTHONPATH` correctly.
    - Updated `ai-agent/agent.py` to use `StdioServerParameters` as a Dictionary instead of an Object (compatibility fix).
    - Updated `mcp-server/main.py` to use `os.getenv("BACKEND_URL")` instead of hardcoded localhost.
    - Switched Agent execution command from `uv run` to `python` to access system libraries in Docker.
4.  **Networking:** Configured internal Kubernetes DNS (`http://todo-backend:8000`) for Agent-to-Backend communication.

## Outcome

- ✅ **Impact:** The full-stack application is running on Minikube with 3 healthy pods.
- 🧪 **Tests:**
    - `kubectl get pods` shows all pods Running.
    - Port forwarding established for Frontend (3000), Backend (8000), and Agent (8001).
    - Chatbot successfully creates tasks in the database via the Agent -> Backend pipeline.
- 📁 **Files:** Created `k8s/` directory and updated Agent source code for container compatibility.
- 🔁 **Next prompts:** Phase 5 (Documentation & Submission).
- 🧠 **Reflection:** The main challenge was the AI Agent's isolated environment in Docker. We iterated through versions (v1 to v5) to fix path issues, library compatibility, and environment variable injection.