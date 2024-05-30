---
description: 'In this document, you’ll learn about the Redis cache module and how you can install it in your Medusa backend.'
---

# Redis Cache Module

In this document, you’ll learn about the Redis cache module and how you can install it in your Medusa backend.

## Overview

Medusa’s modular architecture allows developers to extend or replace the logic used for [caching](../overview.mdx). You can create a custom module, or you can use the modules Medusa provides.

One of these modules is the Redis Module. This module allows you to utilize Redis for the caching functionality. This document will you guide you through installing the Redis Module.

---

## Prerequisites

### Medusa Backend

It’s assumed you already have a Medusa backend installed. If not, you can learn how to install it by following [this guide](../../backend/install.mdx).

### Redis

You must have Redis installed and configured in your Medusa backend. You can learn how to install it from the [Redis documentation](https://redis.io/docs/getting-started/installation/).

---

## Step 1: Install the Module

In the root directory of your Medusa backend, install the Redis cache module with the following command:

```bash npm2yarn
npm install @medusajs/cache-redis
```

---

## Step 2: Add Environment Variable

The Redis cache module requires a connection URL to Redis as part of its options. If you don’t already have an environment variable set for a Redis URL, make sure to add one:

```bash
CACHE_REDIS_URL=<YOUR_REDIS_URL>
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
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: { 
        redisUrl: process.env.CACHE_REDIS_URL,
        ttl: 30,
      },
    },
  },
}
```

This registers the Redis cache module as the main cache service to use. In the options, you pass `redisUrl` with the value being the environment variable you set. 

You also pass the option `ttl`. This means time-to-live, and it indicates the number of seconds an item can live in the cache before it’s removed. If it's set to `0`, the module will skip adding the items to the cache.

Other available options include:

- `redisOptions`: an object containing options for the Redis instance. You can learn about available options in [io-redis’s documentation](https://redis.github.io/ioredis/classes/Redis.html#options). By default, it’s an empty object.
- `namespace`: a string used to prefix event keys. By default, it's `medusa`.

---

## Step 4: Test Module

To test the module, run the following command to start the Medusa backend:

```bash npm2yarn
npx medusa develop
```

If the module was installed successfully, you should see the following message in the logs:

```bash noCopy noReport
Connection to Redis in module 'cache-redis' established
```
