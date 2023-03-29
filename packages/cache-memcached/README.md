# Medusa Cache Redis

Use Memcached as a Medusa cache store.

## Installation

```
yarn add @medusajs/cache-memcached
```

## Config example
Configure the module in the `medusa-config.js` file: 

```
module.exports = {
  // ...
  modules:{ 
    // ...
    "cacheService": 
        {
            resolve: "@medusajs/cache-memcached", 
            options: { location: "localhost:55000" }}
        },
};
```

## Options

```
   {
      ttl?: number                // Time to keep data in cache (in seconds)
      namespace?: string          // Prefix for keys (default is "medusa")
      location:                   // Memcached.Location
      options?:                   // Memcached.options
    }
```

### Other caching modules
- [Medusa Cache In-Memory](../cache-inmemory/README.md)
- [Medusa Cache Redis](../cache-redis/README.md)
