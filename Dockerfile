FROM ubuntu:latest

# Arguments
ARG USERNAME
ARG PAT

SHELL ["/bin/bash", "-c"]
# Install git
RUN apt-get update && \
    apt-get install -y git gcc g++ make gnupg2 curl

# Install nvm and enable
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash && \
    . ~/.bashrc

# Install node16 with nvm
RUN nvm install v16 && nvm use 16.14.2

# Install Yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install -y yarn
RUN yarn set version 1.22

# Clone Repo
RUN git clone https://$USERNAME:$PAT@github.com/$USERNAME/medusa-core-1.9.git /app && cd /app

# Setup Workdir
WORKDIR /app

# Install dependencies and build
RUN yarn && yarn build

CMD ["/bin/bash"]
