
# getting node image version 22 with alpine linux
FROM node:22-alpine

# setting working directory
WORKDIR /app

# copying package.json and package-lock.json files to working directory
COPY package*.json ./

# installing dependencies
RUN npm install

# copying all files to working directory
COPY . .

# building the project
RUN npm run build

# exposing port 3000 and starting the application
EXPOSE 3000

# starting the application in development mode
CMD ["npm", "run", "start:dev"]