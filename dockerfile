# Use latest LTS Node
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Set environment variable
ENV RENDER_URL=https://nrc-user-backend.onrender.com
ENV PORT=80

# Expose port
EXPOSE 80

# Start server
CMD ["node", "server.js"]
