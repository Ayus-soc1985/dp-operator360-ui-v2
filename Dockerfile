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

# Build arguments for environment variables
ARG REACT_APP_WSO2_AUTHORITY=https://sso.uidai.net.in/oauth2/token/.well-known/openid-configuration
ARG REACT_APP_CLIENT_ID=9HGuTetQjRjxkx1vHmoP1v0fXm8a
ARG REACT_APP_CLIENT_SECRET=RlsK9p2f4kJ_iKBZLSgiBYuIKjQa
ARG REACT_APP_REDIRECT_URI=http://localhost:3000/callback
ARG REACT_APP_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
ARG REACT_APP_SILENT_REDIRECT_URI=http://localhost:3000/silent-renew

# Set environment variables for build
ENV REACT_APP_WSO2_AUTHORITY=$REACT_APP_WSO2_AUTHORITY
ENV REACT_APP_CLIENT_ID=$REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_SECRET=$REACT_APP_CLIENT_SECRET
ENV REACT_APP_REDIRECT_URI=$REACT_APP_REDIRECT_URI
ENV REACT_APP_POST_LOGOUT_REDIRECT_URI=$REACT_APP_POST_LOGOUT_REDIRECT_URI
ENV REACT_APP_SILENT_REDIRECT_URI=$REACT_APP_SILENT_REDIRECT_URI

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

# Copy entrypoint script for runtime configuration
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create a default index.html if build didn't create one
RUN test -f /usr/share/nginx/html/index.html || echo '<!DOCTYPE html><html><head><title>App</title></head><body><h1>Application</h1></body></html>' > /usr/share/nginx/html/index.html

EXPOSE 80

WORKDIR /usr/share/nginx/html

# Use entrypoint script to generate runtime config and start nginx
ENTRYPOINT ["/docker-entrypoint.sh"]

