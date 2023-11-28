# # Build stage
# FROM node:19 AS builder
# WORKDIR /app

# #COPY package*.json pnpm-lock.yaml ./

# COPY . .

# RUN sed -i '/provider = "prisma-client-js"/a \ \ binaryTargets = ["native", "linux-musl-openssl-3.0.x"]' prisma/schema.prisma

# RUN npm install -g pnpm
# RUN pnpm install

# RUN #npm run build already post-install

# # Deploy stage
# FROM node:19-alpine

# LABEL maintainer="Hiro <laciferin@gmail.com>"
# #only required for railway deployment
# ARG RAILWAY_ENVIRONMENT=""
# ENV RAILWAY_ENVIRONMENT=$RAILWAY_ENVIRONMENT

# ENV PORT=8080
# ENV NODE_ENV="production"
# ENV MODE="prod"
# ENV DATABASE_URL=""
# ENV JWT_SECRET="Hiro@laciferin"

# WORKDIR /app

# RUN if [ "$RAILWAY_ENVIRONMENT" != "" ]; then echo $RAILWAY_ENVIRONMENT > ".env"; fi

# EXPOSE $PORT

# COPY --from=builder /app ./

# CMD ["sh", "-c", "npm run test && npm run test:e2e"]

# ENTRYPOINT ["npm", "run", "start:prod"]

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

RUN apk update && apk add libreoffice
RUN apk add --no-cache msttcorefonts-installer fontconfig
RUN update-ms-fonts
# Google fonts
RUN wget https://github.com/google/fonts/archive/master.tar.gz -O gf.tar.gz --no-check-certificate
RUN tar -xf gf.tar.gz
RUN mkdir -p /usr/share/fonts/truetype/google-fonts
RUN find $PWD/fonts-master/ -name "*.ttf" -exec install -m644 {} /usr/share/fonts/truetype/google-fonts/ \; || return 1
RUN rm -f gf.tar.gz
RUN fc-cache -f && rm -rf /var/cache/*

# Deploy stage
FROM node:19-alpine

WORKDIR /app

EXPOSE $PORT

COPY --from=builder /app ./

ENTRYPOINT ["npm", "run", "start:prod"]
