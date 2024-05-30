---
description: 'In this document, you’ll learn about the Redis events module and how you can install it in your Medusa backend.'
addHowToData: true
---

# Redis Events Module

In this document, you’ll learn about the Redis events module and how you can install it in your Medusa backend.

## Overview

Medusa’s modular architecture allows developers to extend or completely replace the logic used for events. You can create a custom module, or you can use the modules Medusa provides.

One of these modules is the Redis Module. This module allows you to utilize Redis for the event bus functionality. When installed, the Medusa’s events system is powered by BullMQ and `io-redis`. BullMQ is responsible for the message queue and worker, and `io-redis` is the underlying Redis client that BullMQ connects to for events storage.

This document will you guide you through installing the Redis Module.

---

## Prerequisites

### Medusa Backend

It’s assumed you already have a Medusa backend installed. If not, you can learn how to install it by following [this guide](../../backend/install.mdx).

### Redis

You must have Redis installed and configured in your Medusa backend. You can learn how to install Redis in [their documentation](https://redis.io/docs/getting-started/installation/).

---

## Step 1: Install the Module

In the root directory of your Medusa backend, install the Redis events module with the following command:

```bash npm2yarn
npm install @medusajs/event-bus-redis
```

---

## Step 2: Add Environment Variable

The Redis events module requires a connection URL to Redis as part of its options. If you don’t already have an environment variable set for a Redis URL, make sure to add one:

```bash
EVENTS_REDIS_URL=<YOUR_REDIS_URL>
```

Where `<YOUR_REDIS_URL>` is a connection URL to your Redis instance.

---

## Step 3: Add Configuration

In `medusa-config.js`, add the following to the exported object:

```js title="medusa-config.js"
module.exports = {
  // ...
  modules: {
    // ...
    eventBus: {
      resolve: "@medusajs/event-bus-redis",
      options: { 
        redisUrl: process.env.EVENTS_REDIS_URL,
      },
    },
  },
}
```

This registers the Redis events module as the main event bus service to use. In the options, you pass `redisUrl` with the value being the environment variable you set. This is the only required option.

Other available options include:

- `queueName`: a string indicating the name of the BullMQ queue. By default, it’s `events-queue`.
- `queueOptions`: an object containing options for the BullMQ queue. You can learn about available options in [BullMQ’s documentation](https://api.docs.bullmq.io/interfaces/QueueOptions.html). By default, it’s an empty object.
- `redisOptions`: an object containing options for the Redis instance. You can learn about available options in [io-redis’s documentation](https://redis.github.io/ioredis/index.html#RedisOptions). By default, it’s an empty object.

---

## Step 4: Test Module

To test the module, run the following command to start the Medusa backend:

```bash npm2yarn
npx medusa develop
```

If the module was installed successfully, you should see the following message in the logs:

```bash noCopy noReport
Connection to Redis in module 'event-bus-redis' established
```
