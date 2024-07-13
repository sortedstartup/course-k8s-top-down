# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the server.js and index.html files to the working directory
COPY ./ ./

# Start the web app
CMD [ "node", "server.js" ]