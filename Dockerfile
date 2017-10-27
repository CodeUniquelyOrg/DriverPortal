# Dockerfile

# import the node version we're using
# FROM node:6.10.3
# FROM mhart/alpine-node:6
FROM dmitry7887/alpine-node-git

RUN mkdir -p /usr/app

# copy the package.json (for now)
COPY ./assets/index.js /usr/app
# COPY package.json /usr/app
COPY ./assets/package.json /usr/app

RUN cd /usr/app && npm install
COPY ./dist /usr/app

WORKDIR /usr/app

# tell the software to run/build using these values
ENV NODE_ENV production
ENV PORT 80
ENV WEBAPI_HOST 'http://driverportalwebapitest.azurewebsites.net'
ENV WEBAPI_PORT 80

# expose the container to outside on this port
EXPOSE 80

CMD ["npm", "run", "start:prod"]
