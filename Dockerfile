# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
# ENV NODE_ENV qdevelop

# Setting up the work directory
WORKDIR /express-docker

# Copying all the files in our project
COPY . .
COPY .env.production .env

# Installing dependencies
RUN npm install

# Starting our application
CMD [ "node", "index.js" ]

# Exposing server port
EXPOSE 4000