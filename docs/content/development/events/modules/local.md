---
description: 'In this document, you’ll learn about the local events module and how you can install it in your Medusa backend.'
addHowToData: true
---

# Local Events Module

In this document, you’ll learn about the local events module and how you can install it in your Medusa backend.

## Overview

Medusa’s modular architecture allows developers to extend or completely replace the logic used for events. You can create a custom module, or you can use the modules Medusa provides.

One of these modules is the local events module. This module allows you to utilize Node EventEmitter for the events system in Medusa. The Node EventEmitter is limited to a single process environment. This module is useful for development and testing, but it’s recommended to use the [Redis events module](./redis.md) in production.

This document will you guide you through installing the local events module.

---

## Prerequisites

It’s assumed you already have a Medusa backend installed. If not, you can learn how to install it by following [this guide](../../backend/install.mdx).

---

## Step 1: Install the Module

In the root directory of your Medusa backend, install the Redis events module with the following command:

```bash npm2yarn
npm install @medusajs/event-bus-local
```

---

## Step 2: Add Configuration

In `medusa-config.js`, add the following to the exported object:

```js title=medusa-config.js
module.exports = {
  // ...
  modules: {
    // ...
    eventBus: {
      resolve: "@medusajs/event-bus-local",
    },
  },
}
```

This registers the local events module as the main events service to use. This module does not require any options.

---

## Step 4: Test Module

To test the module, run the following command to start the Medusa backend:

```bash npm2yarn
npm run start
```

If the module was installed successfully, you should see the following message in the logs:

```bash noCopy noReport
Local Event Bus installed. This is not recommended for production.
```
