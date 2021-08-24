FROM node:12

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Bundle app source
COPY . .

# Create database
RUN bin/init-db

# Build static files
RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start" ]
