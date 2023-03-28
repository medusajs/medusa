---
description: 'In this document, you’ll learn about Cache Modules in Medusa, how they work, and which modules Medusa provides.'
---

# How to Create a Cache Module

In this document, you will learn how to build your own Medusa cache module.

## Overview

Medusa provides ready-made modules for cache, including in-memory and Redis modules. If you prefer another technology used for caching in your store, you can build a module and publish it as an NPM package.

In this document, you will learn how to build your own Medusa cache module based on Memcached as an example. This gives you a real-life example of creating the cache module. You can follow the general steps with any other caching system or service.

---

## Prerequisites

If you want to create the Memcached cache module as explained in this guide, you must have [Memcached](https://memcached.org/) installed and running.

---

## Step 1: Creating the Module

The first step is to create and prepare your module for development. You can refer to the [Create a Module](../modules/create.mdx) documentation, specifically the first three steps, to learn how to create your module.

Once you're done, you can start implementing your module.

---

## Step 2: Create the Service

Create the file `src/services/memcached-cache.ts` which will hold your cache service. Note that the name of the file is recommended to be in the format `<service_name>-cache`. So, if you’re not integrating `memcached`, you should replace the name with what’s relevant for your module.

Add the following content to the file:

```ts title=src/services/memcached-cache.ts
import { ICacheService } from "@medusajs/types"

class MemcachedCacheService implements ICacheService {
  async get<T>(key: string): Promise<T> {
    throw new Error("Method not implemented.")
  }
  async set(
    key: string, 
    data: unknown, 
    ttl?: number
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async invalidate(key: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default MemcachedCacheService
```

This creates the class `MemcachedCacheService` that implements the `ICacheService` interface imported from `@medusajs/types`. Feel free to rename the class to what’s relevant for your cache service.

In the class, you must implement three methods: `get`, `set`, and `invalidate`. You’ll learn what each of these methods do in the upcoming section.

---

## Step 3: Implement the Methods

### constructor

The `constructor` method of a service allows you to prepare any third-party client or service necessary to be used in other methods. It also allows you to get access to the module’s options which are typically defined in `medusa-config.js`, and to other services and resources in the Medusa backend using [dependency injection](../fundamentals/dependency-injection.md).

Here’s an example of how you can use the `constructor` to create a memcached instance and save the module’s options:

```ts title=src/services/memcached-cache.ts
import { ICacheService } from "@medusajs/types"
import Memcached from "Memcached"

const DEFAULT_CACHE_TIME = 30

export type MemcachedCacheModuleOptions = {
  /**
   * Time to keep data in the cache (in seconds)
   */
  ttl?: number

  /**
    * Allow passing the configuration for Memcached client
    */
  location: Memcached.Location
  options?: Memcached.options
}

class MemcachedCacheService implements ICacheService {
  protected readonly memcached: Memcached
  protected readonly TTL: number

  constructor(
    {
      // inject services through dependency injection
      // for example the Redis Cache module injects
      // redis connection
      cacheRedisConnection,
    },
    options: MemcachedCacheModuleOptions
  ) {
    this.memcached = new Memcached(
      options.location, 
      options.options
    )
    this.TTL = options.ttl || DEFAULT_CACHE_TIME
  }
  // ...
}
```

### get

The `get` method allows you to retrieve the value of a cached item based on its key. The method accepts a string as a first parameter, which is the key in the cache. It either returns the cached item or `null` if it doesn’t exist.

Here’s an example implementation of this method for a Memcached service:

```ts title=src/services/memcached-cache.ts
class MemcachedCacheService implements ICacheService {
  // ...
  async get<T>(cacheKey: string): Promise<T | null> {
    return new Promise((res, rej) => {
      this.memcached.get(cacheKey, (err, data) => {
        if (err) {
          res(null)
        } else {
          if (data) {
            res(JSON.parse(data))
          } else {
            res(null)
          }
        }
      })
    })
  }
}
```

### set

The `set` method is used to set an item in the cache. It accepts three parameters:

1. The first parameter `key` is a string that represents the key of the data being added to the cache. This key can be used later to get or invalidate the cached item.
2. The second parameter `data` is the data to be added to the cache. There’s no defined type for this data.
3. The third parameter `ttl` is optional. It’s a number indicating how long (in seconds) the data should be kept in the cache.

Here’s an example of an implementation of this method for a Memcached service:

```ts title=src/services/memcached-cache.ts
class MemcachedCacheService implements ICacheService {
  // ...
  async set(
    key: string,
    data: Record<string, unknown>,
    ttl: number = this.TTL
  ): Promise<void> {
    return new Promise((res, rej) =>
      this.memcached.set(
        key, JSON.stringify(data), ttl, (err) => {
        if (err) {
          rej(err)
        } else {
          res()
        }
      })
    )
  }
}
```

### invalidate

The `invalidate` method removes an item from the cache using its key. By default, the item is removed from the cache when the time-to-live (ttl) expires. The `invalidate` method can be used to remove the item beforehand.

The method accepts a string as a first parameter, which is the key of the item to invalidate and remove from the cache.

Here’s an example of an implementation of this method for a Memcached service:

```ts title=src/services/memcached-cache.ts
class MemcachedCacheService implements ICacheService {
  // ...
  async invalidate(key: string): Promise<void> {
    return new Promise((res, rej) => {
      this.memcached.touch(key, 0, (err) => {
        if (err) {
          rej(err)
        }
      })
    })
  }
}
```

---

## Step 4: Export the Service

After implementing the cache service, you must export it so that the Medusa backend can use it.

Create the file `src/index.ts` with the following content:

```ts
import { ModuleExports } from "@medusajs/modules-sdk"

import { MemcachedCacheService } from "./services"

const service = MemcachedCacheService

const moduleDefinition: ModuleExports = {
  service,
}

export default moduleDefinition
```

This exports a module definition, which requires at least a `service`. If you named your service something other than `MemcachedCacheService`, make sure to replace it with that.

You can learn more about what other properties you can export in your module definition in the [Create a Module documentation](../modules/create.mdx#step-5-export-module).

---

## Step 5: Test and Publish your Module

You can learn about how to test your module in a local backend and publish the module to NPM by following the last two steps of the [Create a Module documentation](../modules/create.mdx#step-6-test-your-module).

After installing your module (both when testing or publishing), you can add it to `medusa-config.js` as follows:

```js title=medusa-config.js
module.exports = {
  // ...
  modules: { 
    // ...
    cacheService: {
        resolve: "medusa-cache-memcached", 
        options: { 
          ttl: 30, 
          location: "localhost:55000", 
        },
      },
    },
}
```

Make sure to replace `medusa-cache-memcached` with the name of your module and change the options if necessary.
