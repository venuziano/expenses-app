FROM node:lts-alpine
WORKDIR /app

# install deps
COPY package*.json ./
RUN npm install

# copy source
COPY . .

# watch properly inside Docker
ENV CHOKIDAR_USEPOLLING=true

# expose Vite port
EXPOSE 5173

# run Vite in dev with host=0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
