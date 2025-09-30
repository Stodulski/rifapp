# ========== BUILD STAGE ==========
FROM node:22.13.1-alpine AS builder

WORKDIR /app

# Instalar dependencias del sistema para bcrypt y Prisma
RUN apk add --no-cache python3 make g++ openssl libc6-compat

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# ⭐ Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY . .

# ⭐ Build con TypeScript (ahora SÍ tienes los @types)
RUN npm run build

# ========== PRODUCTION STAGE ==========
FROM node:22.13.1-alpine

WORKDIR /app

# Instalar solo openssl para Prisma
RUN apk add --no-cache openssl libc6-compat

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# ⭐ Ahora SÍ instalar solo producción
RUN npm ci --omit=dev

# Copiar build desde stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/app.js"]