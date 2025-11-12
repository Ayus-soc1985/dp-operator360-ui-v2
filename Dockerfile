FROM harbor-registry-non-prod.uidai.gov.in/base/node:18-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Set npm registry
RUN npm config set registry http://10.10.206.59:8080/repository/npm-proxy/

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM harbor-registry-non-prod.uidai.gov.in/base/nginx:stable-alpine3.21-slim AS prod

# Remove default nginx config
RUN rm -rf /etc/nginx/nginx.conf /etc/nginx/conf.d/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Create a default index.html if build didn't create one
RUN test -f /usr/share/nginx/html/index.html || echo '<!DOCTYPE html><html><head><title>App</title></head><body><h1>Application</h1></body></html>' > /usr/share/nginx/html/index.html

EXPOSE 80

WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

