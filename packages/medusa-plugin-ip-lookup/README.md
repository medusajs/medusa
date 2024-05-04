# ipstack (IP Lookup)

Automatically detect the region and location of your customer using ipstack.

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Look up the location of your customer using ipstack.
- Provides a middleware that can be added to any request to set the region and country of a cart.
- Provides a service that can be used across codebase to detect the location of a user using their IP.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [ipstack account](https://ipstack.com)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-ip-lookup
  ```

2\. Set the following environment variable in `.env`:

  ```bash
  IPSTACK_ACCESS_KEY=<YOUR_ACCESS_KEY>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // other plugins...
    {
      resolve: `medusa-plugin-ip-lookup`,
      options: {
        access_token: process.env.IPSTACK_ACCESS_KEY,
      },
    },
  ]
  ```

---

## Test the Plugin

You can use the `IpLookupService` service to look up the location of an IP, or use the middleware `preCartCreation` on any route.
