FROM node:18-alpine AS builder

WORKDIR /app

# Install npm packages
COPY package*.json ./
RUN npm clean-install

# Copy the source and build
COPY . ./

#RUN CI=true npm run build
RUN npm run build

# Serve build
FROM nginx:stable-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
