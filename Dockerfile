# building stage
FROM node:23-alpine AS builder

# set environment variables for the build stage
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app

# install all dependencies
COPY package.json package-lock.json ./
RUN npm install

# build the application
COPY . .
RUN npm run build

# production stage
FROM node:23-alpine AS runner

WORKDIR /app

# copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY public ./public
COPY next.config.mjs ./next.config.mjs

# install only production dependencies
RUN npm install --omit=dev

# expose the port the Next.js app runs on
EXPOSE 3000

# start the Next.js production server
CMD ["npm", "run", "start"]