# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
# Adjust 'dist' to 'build' if you are using Create React App instead of Vite
COPY --from=build /app/dist /usr/share/nginx/html
# Copy your custom nginx config (see step 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
