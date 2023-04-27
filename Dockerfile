FROM ubuntu:latest

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# Install git
RUN apt-get update && \
    apt-get install -y git gcc g++ make gnupg2 curl && \
    apt-get -y autoclean

# Install nvm and enable
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 16.14.2
# https://github.com/creationix/nvm#install-script
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# confirm installation
RUN node -v
RUN npm install -g yarn

# Clone Repo
RUN git clone https://github.com/yakshup/medusa-core-1.9.git /app && cd /app

# Setup Workdir
WORKDIR /app

# Install dependencies and build
RUN yarn
RUN yarn build

CMD ["/bin/bash"]
