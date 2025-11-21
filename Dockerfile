FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json /app/

# ENV http_proxy=http://10.10.16.22:3128
# ENV https_proxy=http://10.12.11.13:3128

# proxy
RUN npm config set registry http://10.10.206.59:8080/repository/npm-proxy/
# RUN npm config set https-proxy http://10.12.11.13:3128

RUN npm ci

COPY . /app/

RUN npm run build

# Verify build output
RUN ls -la ./build/

FROM nginx:alpine-slim AS prod

#Configure nginx
RUN rm -rf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf 
COPY default.conf /etc/nginx/conf.d/default.conf

#Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Verify copied files
RUN ls -la /usr/share/nginx/html/

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Ensure log directory exists and is writable
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /var/log/nginx

# Create symbolic links for stdout/stderr logging (Kubernetes best practice)
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

#Copy script and env 
WORKDIR /usr/share/nginx/html
# COPY backend.sh .
# COPY backend.env .


# Make our shell scripts executable
# RUN chmod +x backend.sh 

# Test nginx configuration
RUN nginx -t

# Modify CMD to execute both scripts
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]

