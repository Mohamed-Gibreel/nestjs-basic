FROM node:20.15.1-alpine

RUN mkdir /home/nestjs-app

COPY ./src/ /home/nestjs-app/
COPY ./prisma/ /home/nestjs-app/
COPY ./test/ /home/nestjs-app/
COPY ./package.json /home/nestjs-app/
COPY ./package-lock.json /home/nestjs-app/
COPY ./nest-cli.json /home/nestjs-app/
COPY ./tsconfig.json /home/nestjs-app/
COPY ./tsconfig.build.json /home/nestjs-app/
COPY ./.env /home/nestjs-app/
# COPY ./dist/ /home/nestjs-app/

WORKDIR /home/nestjs-app/

RUN npm install

RUN npm run build

CMD npm run start:prod

