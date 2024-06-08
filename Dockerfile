FROM node:20-alpine
RUN apk add --no-cache python3 g++ make \
    pkgconfig cairo-dev pango-dev

# Install Python and other dependencies required for node-gyp
# RUN apt-get update && apt-get install -y python3 build-essential

WORKDIR /app

# Install app dependencies.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

RUN npm install


COPY . .

# Compile TypeScript files.
RUN npx tsc

# Expose the port the app runs on.
EXPOSE 8000
# RUN yarn install --production
CMD ["node", "/app/src/index.ts"]