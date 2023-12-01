# Use Node.js v14 as the base image
FROM node:14
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install npm packages
RUN npm install
# Copy the rest of the code to the working directory
COPY . .
# Command to run the application
CMD ["npm", "start"]
