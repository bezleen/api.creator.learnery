# Contributing to this project

### How to cache?

[Cache Doc](https://docs.nestjs.com/techniques/caching)

### How to access db?

This project utilizes ["Prisma"](https://www.prisma.io), an ORM (Object Relation Mapper)
which facilitates db migrations, Typescript model generation out of the box.


### Project Dev commands

1. `nest g resource`
2. `nest g module`
3. `nest g controller`
4. `nest g service`
5. `nest g filter`
6. `cp .env.local .env && prisma migrate dev`
7. `cp .env.local .env && prisma db seed`


### How to create tables/models?

1. Make the necessary changes in prisma/schema.prisma
2. `prisma generate `
3. To deploy:  
   `pnpm prisma:local:deploy`

### Pnpm vs npm

- npm: Executes pre/post scripts
- pnpm: doesn't execute pre scripts
