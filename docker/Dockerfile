# Use a valid Node.js version (e.g., 14.x LTS)
FROM node:lts-slim

# Stage 1: Build the application
WORKDIR /srv/app
COPY package*.json ./
RUN npm install
COPY . .
ENV REACT_APP_API_URL=https://api.gbxarchive.uk
RUN npm run build

# Stage 2: Create the final image
FROM node:lts-slim
WORKDIR /srv/app
COPY --from=0 /srv/app .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
