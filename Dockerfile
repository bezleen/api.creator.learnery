# Build stage
FROM node:19 AS builder
WORKDIR /app

#COPY package*.json pnpm-lock.yaml ./

COPY . .
# for MACBOOK chip M
# RUN sed -i '/provider = "prisma-client-js"/a \ \ binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]' prisma/schema.prisma 
# for LINUX
RUN sed -i '/provider = "prisma-client-js"/a \ \ binaryTargets = ["native", "linux-musl-openssl-3.0.x"]' prisma/schema.prisma

RUN npm install -g pnpm
RUN pnpm install

RUN #npm run build already post-install

# Deploy stage
FROM node:19-alpine
WORKDIR /app

EXPOSE 7008

COPY --from=builder /app ./

ENTRYPOINT ["npm", "run", "start:prod"]
