# Medusa

Medusa is a headless commerce engine built with Node.js using Express with a Postgresql database. 

## Documentation

See [Medusa Commerce API docs](https://docs.medusa-commerce.com/api/store/) for Node.js.

## Get started in less than 5 minutes

You can get a Medusa engine up and running in your local development environment within a couple of minutes. Perform the following steps:

1. Install Medusa, the Medusa CLI, Medusa babel preset and Medusa interfaces

    ```bash
    # core medusa
    npm install @medusajs/medusa
    yarn add @medusajs/medusa

    # CLI
    npm install -g @medusajs/medusa-cli
    yarn add global @medusajs/medusa-cli
    
    # babel preset
    npm install babel-preset-medusa-package
    yarn add babel-preset-medusa-package
    
    # interfaces
    npm install medusa-interfaces
    yarn add medusa-interfaces
    ```
2. Create a file `medusa-config.js` at the root level of your Node.js project and fill in required settings
    ```
    // CORS to avoid issues when consuming Medusa from a client
    const STORE_CORS = "http://localhost:8000";

    // Database URL (here we use a local database called medusa-development)
    const DATABASE_URL = "postgres://localhost/medusa-development";
    
    // Medusa uses Redis, so this needs configuration as well
    const REDIS_URL = "redis://localhost:6379"

    // This is the place to include plugins. See API documentation for a thorough guide on plugins.
    const plugins = [];

    module.exports = {
      projectConfig: {
        redis_url: REDIS_URL,
        database_url: DATABASE_URL,
        database_logging: true,
        database_extra:
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "staging"
            ? {
                ssl: { rejectUnauthorized: false },
              }
            : {},
        database_type: "postgres",
        store_cors: STORE_CORS,
      },
      plugins,
    };
    ```

3. Create a Medusa user, such that you can perform authenticated calls

    ```bash
    # provide email and password to the command
    medusa user -e lebron@james.com -p lebronjames123
    ```

4. Start your Medusa engine in your local environment

    ```bash
    medusa develop
    ```
    
5. Open any client or API tool to start using your Medusa engine

    Medusa is running at `http://localhost:4000`. You should now investigate our [API docs](https://docs.medusa-commerce.com/api/store/) to start playing around with your new headless commerce engine.

After these four steps and only a couple of minutes, you now have a complete commerce engine running locally. 

## Contribution

Medusa is all about the community. Therefore, we would love for you to help us build the most robust and powerful commerce engine on the market. Whether its fixing bugs, improving our documentation or simply spreading the word, please feel free to join in.

## Repository structure

The Medusa repository is a mono-repository managed using Lerna. Lerna allows us to have all Medusa packages in one place, and still distribute them as separate NPM packages.

## Licensed

Licensed under the [MIT License](https://github.com/medusajs/medusa/blob/master/LICENSE)

## Thank you!
