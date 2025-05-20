# ----------------------------------------
# 1. Etapa de compilación (builder)
# ----------------------------------------
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copia sólo los archivos de dependencias y haz install
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copia el resto del código fuente
COPY . .

RUN npm run build -- \
    --configuration production \
    --output-path=dist

# ----------------------------------------
# 2. Etapa de ejecución (runner)
# ----------------------------------------
FROM nginx:1.25-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

