FROM ubuntu:latest

# Arguments
ARG USERNAME
ARG PAT

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

# Install Yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install -y yarn
RUN yarn set version 1.22

# Clone Repo
RUN git clone https://$USERNAME:$PAT@github.com/$USERNAME/medusa-core-1.9.git /app && cd /app

# Setup Workdir
WORKDIR /app

# Install dependencies and build
RUN yarn && yarn build

CMD ["/bin/bash"]
