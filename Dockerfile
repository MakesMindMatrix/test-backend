FROM node:18-slim AS builder
WORKDIR /app
COPY package.json package.lock .
RUN npm install --frozen-lockfile
COPY . .
RUN npm build

# second stage
FROM node:18-slim
WORKDIR /app
COPY package.json package.lock .
RUN npm install --production --frozen-lockfile
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["npm", "start"]