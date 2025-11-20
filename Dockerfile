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

# Create nginx user and required directories
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Create required directories with correct permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    mkdir -p /var/run && \
    chown -R nginx:nginx /var/run

# Remove any existing nginx configs
RUN rm -rf /etc/nginx/conf.d/* || true

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Set proper permissions for web files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Copy custom nginx configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/app.conf

# Set proper permissions for config files
RUN chown -R nginx:nginx /etc/nginx && \
    chmod 644 /etc/nginx/nginx.conf && \
    chmod 644 /etc/nginx/conf.d/app.conf

# Create a default index.html if build didn't create one
RUN test -f /usr/share/nginx/html/index.html || echo '<!DOCTYPE html><html><head><title>Operator 360</title></head><body><h1>Operator 360 Application</h1></body></html>' > /usr/share/nginx/html/index.html

# Test nginx configuration
RUN nginx -t

# Create startup script for better error handling
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "Starting Operator 360 Application..."' >> /start.sh && \
    echo 'echo "Checking nginx configuration..."' >> /start.sh && \
    echo 'nginx -t' >> /start.sh && \
    echo 'if [ $? -eq 0 ]; then' >> /start.sh && \
    echo '    echo "Configuration is valid, starting nginx..."' >> /start.sh && \
    echo '    exec nginx -g "daemon off;"' >> /start.sh && \
    echo 'else' >> /start.sh && \
    echo '    echo "Nginx configuration error!"' >> /start.sh && \
    echo '    exit 1' >> /start.sh && \
    echo 'fi' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80

WORKDIR /usr/share/nginx/html

# Use startup script for better error handling
CMD ["/start.sh"]

