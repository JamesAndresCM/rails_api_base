FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app
RUN npm install --silent
RUN npm install --silent -g @angular/cli@1.7.1 2> /dev/null
COPY . /usr/src/app
CMD ng serve --host 0.0.0.0
