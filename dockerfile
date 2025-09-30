FROM node:22.13.1

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run build && npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]
