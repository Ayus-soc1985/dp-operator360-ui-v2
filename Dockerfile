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

RUN cat ./build/envConfig.js 

FROM nginx:alpine-slim AS prod

#Configure nginx
RUN rm -rf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf 

#Copy build files
COPY --from=build /app/build /usr/share/nginx/html
RUN cat /usr/share/nginx/html/envConfig.js 

EXPOSE 80

#Copy script and env 
WORKDIR /usr/share/nginx/html
# COPY backend.sh .
# COPY backend.env .


# Make our shell scripts executable
# RUN chmod +x backend.sh 

# Modify CMD to execute both scripts
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]

