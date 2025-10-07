FROM node:20-alpine
WORKDIR /app

# Copy only what always exists
COPY package.json ./

# Install deps (use ci if lockfile exists at runtime)
RUN if [ -f package-lock.json ]; then echo "Using npm ci"; else echo "No lockfile, running npm install after copying sources"; fi

# Now copy the rest
COPY . .

# Install (choose one approach)
# If you keep lockfile in repo, uncomment next two lines and delete the 'if' above:
# COPY package-lock.json ./
# RUN npm ci
# Otherwise:
RUN npm install

# Optional: build (Nest dev doesn’t need it)
# RUN npm run build

CMD ["npm","run","start:dev"]
