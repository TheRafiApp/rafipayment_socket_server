FROM node:boron
# FROM node:5.12.0 # no npm

RUN mkdir -p /app
WORKDIR /app

# adding dependecy definitions first prevents reinstallation on change
ADD package.json /app/

RUN npm install

ADD . /app

EXPOSE 4200

CMD ["npm", "start"]
