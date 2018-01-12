FROM node:latest

RUN apt-get update

RUN apt-get -y install npm

RUN mkdir -p /app
WORKDIR /app

# adding dependecy definitions first prevents reinstallation on change
ADD package.json /app/

RUN npm install

ADD . /app

EXPOSE 4200

CMD ["npm", "start"]
