FROM node:20-slim

WORKDIR /app
# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

COPY . .

# This is the secret sauce for Next.js in Docker
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "dev"]