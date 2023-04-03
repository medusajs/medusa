---
description: 'In this document, you’ll learn about the in-memory cache module and how you can install it in your Medusa backend.'
---

# In-Memory Cache Module

In this document, you’ll learn about the in-memory cache module and how you can install it in your Medusa backend.

## Overview

Medusa’s modular architecture allows developers to extend or completely replace the logic used for caching. You can create a custom module, or you can use the modules Medusa provides.

Medusa’s default starter project uses the in-memory cache module. The in-memory cache module uses a plain JavaScript Map object to store the cache data.

This module is helpful for development or when you’re testing out Medusa, but it’s not recommended to be used in production. For production, it’s recommended to use modules like [Redis Cache Module](./redis.md).

This document will guide you through installing the in-memory cache module.

---

## Prerequisites

### Medusa Backend

It’s assumed you already have a Medusa backend installed. If not, you can learn how to install it by following [this guide](../../backend/install.mdx).

---

## Step 1: Install the Module

In the root directory of your Medusa backend, install the in-memory cache module with the following command:

```bash npm2yarn
npm install @medusajs/cache-inmemory
```

---

## Step 2: Add Configuration

In `medusa-config.js`, add the following to the exported object:

```js title=medusa-config.js
module.exports = {
  // ...
  modules: {
    // ...
    cacheService: {
      resolve: "@medusajs/cache-inmemory",
      options: {
        ttl: 30,
      },
    },
  },
}
```

This registers the in-memory cache module as the main cache service to use. You pass it the option `ttl`. This means time-to-live, and it indicates the number of seconds an item can live in the cache before it’s removed.

---

## Step 3: Test Module

To test the module, run the following command to start the Medusa backend:

```bash npm2yarn
npm run start
```

The backend should then start with no errors, indicating that the module was installed successfully.
