# Use the official Node image as a parent image
FROM node:14 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Use the official Nginx image as a parent image
FROM nginx:alpine

# Copy the build folder from the build stage to the nginx public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]

# Build: docker build -t fras_front .
# Run: docker run -p 3000:80 fras_front
