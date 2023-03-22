FROM node:18 AS builder

WORKDIR /medusa

COPY package.json .
COPY yarn.* .

COPY . .

RUN yarn install
RUN yarn build

RUN node /medusa/packages/medusa-dev-cli/dist/index.js --set-path-to-repo /medusa

WORKDIR /

# force `medusa new` to use yarn
ENV npm_config_user_agent=yarn

RUN node /medusa/packages/medusa-cli/dist/index.js new medusa-store
WORKDIR medusa-store
COPY .ergomake/medusa-config.js .
RUN node /medusa/packages/medusa-dev-cli/dist/index.js -s

FROM node:18-alpine AS runner

RUN yarn global add wait-port

WORKDIR /medusa-store

COPY --from=builder /medusa-store .

CMD sh -c 'wait-port postgres:5432 && \
           ./node_modules/.bin/medusa seed -f data/seed.json && \
           ./node_modules/.bin/medusa start'

