FROM node:alpine

WORKDIR /app

# Add the following line 
ENV CI=true

COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]