# Contentful

Manage the content of your storefront with rich Content Management System (CMS) capabilities using Contentful.

[Contentful Plugin Documentation](https://docs.medusajs.com/plugins/cms/contentful/) | [Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Handle the presentational content of your commerce application using Contentful.
- Two-way sync between Medusa and Contentful, allowing you to manage products details consistently.
- Benefit from Contentful's advanced CMS features such as localization and versioning.

---

## Prerequisites

- [Contentful account](https://stripe.com/)
- [Medusa CLI Tool](https://docs.medusajs.com/cli/reference#how-to-install-cli-tool)
- [PostgreSQL](https://docs.medusajs.com/development/backend/prepare-environment#postgresql)
- [Redis](https://docs.medusajs.com/development/backend/prepare-environment#redis)

---

## How to Install

1\. Run the following command to install a new Medusa server configured with Contentful:

  ```bash
  medusa new medusa-contentful https://github.com/medusajs/medusa-starter-contentful
  ```

2\. Change to the newly created directory `medusa-contentful`:

  ```bash
  cd medusa-contentful
  ```

3\. Set the following environment variables in `.env`:

  ```bash
  CONTENTFUL_SPACE_ID=<YOUR_CONTENTFUL_SPACE_ID>
  CONTENTFUL_ACCESS_TOKEN=<YOUR_CONTENTFUL_ACCESS_TOKEN>
  CONTENTFUL_ENV=<YOUR_CONTENTFUL_ENV>
  REDIS_URL=<YOUR_REDIS_URL>
  DATABASE_URL=<YOUR_DB_URL>
  ```

3\. In `medusa-config.js`, enable PostgreSQL and remove the SQLite configurations:

  ```js
  module.exports = {
    projectConfig: {
      // ...
      database_url: DATABASE_URL,
      database_type: "postgres",
      // REMOVE OR COMMENT OUT THE BELOW:
      // database_database: "./medusa-db.sql",
      // database_type: "sqlite",
    },
  }
  ```

4\. Migrate the content types into Contentful with the following command:

  ```bash
  npm run migrate:contentful
  ```

5\. Seed Contentful with demo content data using the following command:

  ```bash
  npm run seed:contentful
  ```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

  ```bash
  npm run start
  ```

2\. You can then setup the [Gatsby Contentful Storefront](https://docs.medusajs.com/plugins/cms/contentful/#setup-gatsby-storefront), or connect to Contentful from your own storefront to retrieve content data.

---

## Additional Resources

- [Contentful Plugin Documentation](https://docs.medusajs.com/plugins/cms/contentful/)
