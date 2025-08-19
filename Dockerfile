# Etapa 1: Construcción
FROM node:18 AS build
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el proyecto y construir
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Para CRA usa: /app/build en lugar de /app/dist

# Configuración Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
