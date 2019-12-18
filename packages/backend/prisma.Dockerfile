FROM node:12-alpine

USER root

RUN npm i -g --unsafe-perm prisma2@latest
