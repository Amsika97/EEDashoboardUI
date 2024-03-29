FROM node:18.18.0-alpine
 
RUN mkdir /app
 
WORKDIR /app
 
COPY package.json ./
 
RUN npm install
 
COPY . /app
 
RUN nohup ng serve --host 0.0.0.0 --port 443 &
 
EXPOSE 443