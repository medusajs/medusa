FROM node:18 AS builder

WORKDIR /medusa

COPY package.json .
COPY yarn.* .

COPY . .

RUN yarn install
RUN yarn build

RUN node /medusa/packages/medusa-dev-cli/dist/index.js --set-path-to-repo /medusa

WORKDIR /

RUN yarn global add create-next-app
RUN create-next-app -e https://github.com/medusajs/nextjs-starter-medusa storefront

WORKDIR /storefront
RUN mv next.config.js original-next.config.js
COPY .ergomake/next.config.js .
RUN node /medusa/packages/medusa-dev-cli/dist/index.js -s

FROM node:18-alpine AS runner

ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL

RUN yarn global add wait-port

WORKDIR /storefront

COPY --from=builder /storefront .

ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL $NEXT_PUBLIC_MEDUSA_BACKEND_URL

EXPOSE 8000

# it talks to the backend while building so we must build only when starting the container
CMD sh -c 'wait-port backend:9000 && yarn build && yarn start'

