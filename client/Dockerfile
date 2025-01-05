FROM node:16-alpine

WORKDIR /app

COPY client/package*.json ./

RUN npm install

COPY client/ .

RUN npm run build

# Serve the React app using a static file server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000