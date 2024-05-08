# Etapa 1: Construir la aplicación Angular en un entorno de Node.js
FROM node:20 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa 2: Preparar el servidor Nginx para servir la aplicación construida
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
