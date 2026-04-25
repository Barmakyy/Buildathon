FROM node:20-alpine
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@latest

# Install git for potential dependencies
RUN apk add --no-cache git

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod --no-optional || pnpm install --prod

# Copy source code
COPY src ./src

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "src/server.js"]
