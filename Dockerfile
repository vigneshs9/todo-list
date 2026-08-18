FROM node:22 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/todo-list /usr/share/nginx/html/todo-list
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]