FROM node:latest

RUN apt-get -y update && apt-get -y upgrade

# install npm
RUN apt-get -y install npm

RUN mkdir -p /app
WORKDIR /app

ADD package.json /app/
RUN npm install

ADD . /app

EXPOSE 4200

CMD ["npm", "start"]
