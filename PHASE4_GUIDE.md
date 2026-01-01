<!-- PHASE4_GUIDE.md -->
```markdown
# Phase 4: Kubernetes Deployment Guide

This document contains all the commands used to deploy the Todo App on Minikube.

## 1. Prerequisites
Start your local cluster:
```bash
minikube start

```

## 2. Docker Builds

Run these commands in the root of your project to build images directly into Minikube's Docker daemon.

**Backend:**

```bash
docker build -t todo-backend:v1 -f backend/Dockerfile .
minikube image load todo-backend:v1

```

**Frontend:**

```bash
docker build -t todo-frontend:v1 -f frontend/Dockerfile .
minikube image load todo-frontend:v1

```

**AI Agent (Final Version v5):**

```bash
docker build -t todo-agent:v5 -f ai-agent/Dockerfile .
minikube image load todo-agent:v5

```

## 3. Deployment

Apply the configurations to the cluster:

```bash
# 1. Apply Secrets (Database & OpenAI Key)
kubectl apply -f k8s/secrets.yaml

# 2. Apply Services & Deployments
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/agent.yaml

```

**Check Status:**

```bash
kubectl get pods

```

*(Wait until all show STATUS: Running)*

## 4. Access the App (Port Forwarding)

Since we are using Minikube, we need to forward ports to access the services on localhost.
Open **3 separate terminals** and run these:

**Terminal 1 (Backend):**

```bash
kubectl port-forward svc/todo-backend 8000:8000

```

**Terminal 2 (Frontend):**

```bash
kubectl port-forward svc/todo-frontend 3000:3000

```

**Terminal 3 (AI Agent):**

```bash
kubectl port-forward svc/todo-agent 8001:8001

```

## 5. Usage

* Open Browser: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* Chat with the bot: "Create a task to learn Kubernetes"

## 6. Troubleshooting

If the Agent crashes, check logs:

```bash
kubectl logs -l app=todo-agent -f

```

```

---

### 3. Git Push & Tagging (Phase 4 Finalization)

Ab aakhri kaam: Apne code ko GitHub par save karna aur Tag lagana.

Apne main terminal mein ye commands one-by-one chalayen:

1.  **Files Add karein:**
    ```bash
    git add .
    ```

2.  **Commit karein:**
    ```bash
    git commit -m "feat: complete phase 4 kubernetes deployment with ai agent v5"
    ```

3.  **Push Code:**
    ```bash
    git push origin main
    ```
    *(Agar aap kisi aur branch par hain to `main` ki jagah wo branch name likhein)*

4.  **Tag Create karein (Phase 4):**
    ```bash
    git tag -a phase4 -m "Completed Phase 4: Kubernetes Deployment"
    ```

5.  **Tag Push karein:**
    ```bash
    git push origin phase4
    ```

---

### 🎉 Conclusion
Aapka Phase 4 ab mukammal taur par **Documented**, **History-Logged**, aur **Version Controlled** hai.

Ab aapka project submission ke liye ready hai! Koi aur cheez verify karni hai?

```