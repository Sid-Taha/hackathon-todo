# frontend/Dockerfile

# Node.js base image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Dependencies file copy karein
COPY package.json package-lock.json* ./

# Dependencies install karein
RUN npm install

# Pura frontend code copy karein
COPY . .

# Build karein
RUN npm run build

# Port expose karein
EXPOSE 3000

# Next.js app start karein
CMD ["npm", "start"]