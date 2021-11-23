# Redis not emitting events

When you create a new Medusa project, Redis is disabled by default. Instead, we use a fake Redis server, that allows you to start your project, but holds no functionality. 

To enable a real Redis server, you need to install and start it up on your PC. Install it directly from their [website](https://redis.io/download) or use Homebrew and run the following commands:
```bash
brew install redis
brew services start redis
```

Additonally, ensure that `redis_url` is not commented out in your project configuration in the bottom of your `medusa-config.js`.
```jsx
module.exports = {
  projectConfig: {
    redis_url: REDIS_URL, // <-- Enables a real Redis server
    database_url: DATABASE_URL,
    database_type: "postgres",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins,
};
```