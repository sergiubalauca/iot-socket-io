FROM node:16.13-alpine
# if there is a folder called app, use it, otherwise create it
# any following commands followed by workdir are executed inhere
WORKDIR /app
# for chaching purposes - add everything inside package + package-lock.json to the app dir
# ADD package*.json ./
# RUN npm install
# add everything inside this dir to the app directory
ADD . .
RUN npm install
CMD npm run start