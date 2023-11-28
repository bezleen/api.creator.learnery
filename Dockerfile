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

# Deploy stage
FROM node:19-alpine

WORKDIR /app

RUN apk update && apk add libreoffice
RUN apk add --no-cache msttcorefonts-installer fontconfig
RUN update-ms-fonts
# Google fonts
RUN wget https://github.com/google/fonts/archive/main.tar.gz -O gf.tar.gz && \
    tar -xf gf.tar.gz && \
    mkdir -p /usr/share/fonts/truetype/google-fonts && \
    find $PWD/fonts-main/ -name "*.ttf" -exec install -m644 {} /usr/share/fonts/truetype/google-fonts/ \; || return 1 && \
    rm -f gf.tar.gz && \
    # Remove the extracted fonts directory
    rm -rf $PWD/fonts-main && \
    # Remove the following line if you're installing more applications after this RUN command and you have errors while installing them
    rm -rf /var/cache/* && \
    fc-cache -f

EXPOSE $PORT

COPY --from=builder /app ./

ENTRYPOINT ["npm", "run", "start:prod"]
