---
title: 0. Set up your development environment
---

# Set up your development environment

## Introduction

Welcome to Medusa - we are so excited to get you on board!

This tutorial will walk you through the steps to take to set up your local development environment. You will familiarize yourself with some of the core parts that make Medusa work and learn how to configure your development environment. Furthermore you will be introduced to how the plugin architecture works and how to customize your commerce functionalities with custom logic and endpoints.

<!-- As a final part of the tutorial you will be linking your local project to Medusa Cloud where you can leverage advanced tools that make it easy to develop, test and deploy your Medusa project. -->

## Background Knowledge and Prerequisites

This tutorial aims to be as inclusive as possible so that most people with a bit of web development exeperience will be able to follow along and understand what is going on. In case you are completely new to programming and are just setting out to start working on your first project it will be helpful to familiarize yourself with a couple of the technologies that Medusa is build on

- **JavaScript**: The programming language that Medusa is written in. It is the language that runs in your browser to create dynamic web applications and has over the past decade gained a lot of traction as a backend language. If you wish to customize or extend Medusa it is highly recommended that you learn how JavaScript works. You can learn more about JavaScript with the [Basic JavaScript course from freeCodeCamp.](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#basic-javascript)
- **SQL & Postgresql**: Medusa uses the relational database PostgreSQL as the database layer where data is persisted. To understand how different entities relate to each other in Medusa it is helpful to have a good understanding of SQL. You can learn more about SQL and relational databases with the [SQL and Databases course from freeCodeCamp.](https://www.freecodecamp.org/news/sql-and-databases-full-course/)
- The **command line**: The command line is a text interface for your computer. It is used to run commands such as starting a program, performing a task or interfacing with the files on your computer. If you have never used the command line before you can check out [this tutorial](https://www.learnenough.com/command-line-tutorial) to get the basics in place.

To get a further understanding of what powers Medusa you can lookup these concepts:

- [**REST APIs**](https://en.wikipedia.org/wiki/Representational_state_transfer)
- [**Dependency Injection**](https://en.wikipedia.org/wiki/Dependency_injection)
- [**Idempotency Keys**](https://brandur.org/idempotency-keys)

## Installations

To get your development environment ready you need to install the following tools:

- Node.js
- Git
- Postgresql
- Redis
- Medusa CLI

### Node.js

Node.js is an environment that can execute JavaScript code on outside of the browser making it possible to run on a server. Node.js is the environment that makes it possible for Medusa to run so you must install Node.js on your computer to start Medusa development.

Node.js has a bundled package manager called npm. npm helps you install "packages" which are small pieces of code that you can leverage in your Node.js applications. Medusa's core is itself a package distributed via npm and so are all of the plugins that exist around the core. [You can install Node.js from here.](https://nodejs.org/en/)

If you prefer using something like homebrew you can also run:

```
brew install node
```

> **Mac users**: Make sure that you have Xcode command line tools installed; if not run `xcode-select --install`

### Git

Git is a version control system that keeps track on files within a project and makes it possible to do things like going back in history if you have made mistakes or collaborate with teammates without overriding each other's work. Almost all developers use Git for version control. Medusa uses git behind the scenes when you create a new project so you'll have to install it on your computer to get started.

If you are a Mac user you will already have Git installed as part of the Xcode command line tools, but for good measure check out installation of Git on different systems below:

- [Install Git on macOS](https://www.atlassian.com/git/tutorials/install-git)
- [Install Git on Windows](https://www.atlassian.com/git/tutorials/install-git#windows)
- [Install Git on Linux](https://www.atlassian.com/git/tutorials/install-git#linux)

### PostgreSQL

PostgreSQL is an open-source relational database system with more than 30 years of active development. It is robust, reliable and ensures data integrity so there's no need to worry about those when you scale your project. Medusa uses PostgreSQL as its database and you will need to install it on your computer to get going. [Install PostgreSQL from here.](https://www.postgresql.org/download/).

If you prefer to use homebrew you may install PostgreSQL by running:

```
brew install postgresql
brew services start postgresql
createdb
```

### Redis

Redis is an open-source in memory data structure store which is used in Medusa to emit messages in the system and cache data. [Install Redis from here.](https://redis.io/download)

If you prefer to use homebrew you may install Redis by running:

```
brew install redis
brew services start redis
```

### Medusa CLI

The final installation to do to get started with Medusa is the Medusa CLI, which is an npm package you can install globally on your computer to get instant access to commands that help you manage and run your Medusa project. As the Medusa CLI is distributed as an npm package it is very easily installed by running:

```
npm install -g @medusajs/medusa-cli
```

We like to use Yarn instead of npm; if you wish to do the same you can install the CLI with:

```
yarn global add @medusajs/medusa-cli
```

### Text editor

If you don't already have a text editor of choice you should find one you like - here is a couple of candidates:

- [Neovim](https://neovim.io/) (if you are super oldschool there's also plain [Vim](https://www.vim.org/))
- [VS Code](https://code.visualstudio.com/)
- [Atom](https://atom.io/)

It is not important which editor you use as long as you feel comfortable working with it.

<!-- ## Medusa Cloud account

As the final step in this part of the tutorial you should create a Medusa Cloud account. Medusa Cloud is the platform that works with Medusa; the platform is where you view and manage your store, but is also a key part of the development process as you will be linking your local project to the platform so that you can manage your store while in development.

[Sign up for Medusa Cloud](https://app.medusa-commerce.com) -->

## Summary

You now have all required software installed on your computer and have been introduced to a bit of our tech stack. In the next part of this tutorial we will be setting up a Medusa project for the first time and start making API requests.
