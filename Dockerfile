FROM node:22-alpine AS builder
WORKDIR /app

# Bước 1: Copy package.json và package-lock.json (QUAN TRỌNG)
COPY package*.json ./

# Bước 2: Cài đặt dependencies
RUN npm install

# Bước 3: Copy toàn bộ source code
COPY . .

# Bước 4: Build production
RUN npm run build

# Phase 2: Triển khai với Nginx
FROM nginx:alpine

# Copy files build từ stage builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy config Nginx
COPY nginx-fe.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]