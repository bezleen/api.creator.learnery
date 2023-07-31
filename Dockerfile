# Build stage
FROM node:19 AS builder
WORKDIR /app

#COPY package*.json pnpm-lock.yaml ./

COPY . .

RUN sed -i '/provider = "prisma-client-js"/a \ \ binaryTargets = ["native", "linux-musl-openssl-3.0.x"]' prisma/schema.prisma

RUN npm install -g pnpm
RUN pnpm install

RUN #npm run build already post-install

# Deploy stage
FROM node:19-alpine

LABEL maintainer="Hiro <laciferin@gmail.com>"
#only required for railway deployment
ARG RAILWAY_ENVIRONMENT=""
ENV RAILWAY_ENVIRONMENT=$RAILWAY_ENVIRONMENT

ENV PORT=8080
ENV NODE_ENV="production"
ENV MODE="prod"
ENV DATABASE_URL=""
ENV JWT_SECRET="Hiro@laciferin"

WORKDIR /app

RUN if [ "$RAILWAY_ENVIRONMENT" != "" ]; then echo $RAILWAY_ENVIRONMENT > ".env"; fi

EXPOSE $PORT

COPY --from=builder /app ./

CMD ["sh", "-c", "npm run test && npm run test:e2e"]

ENTRYPOINT ["npm", "run", "start:prod"]
