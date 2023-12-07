---
addHowToData: true
---

# IP Lookup (ipstack) Plugin

In this document, you’ll learn how to install the IP Lookup plugin on your Medusa backend.

## Overview

Location detection in a commerce store is essential for multi-region support. Medusa provides an IP Lookup plugin that integrates the backend with [ipstack](https://ipstack.com/) to allow you to detect a customer’s location and, ultimately, their region.

This guide explains how you can install and use this plugin.

---

## Prerequisites

### Medusa Backend

Before you follow this guide, you must have a Medusa backend installed. If not, you can follow the [quickstart guide](../../create-medusa-app.mdx) to learn how to do it.

### ipstack Account

You need an [ipstack account](https://ipstack.com/) before using this plugin. You can create a free account with ipstack on their website.

---

## Install Plugin

In the root directory of your Medusa backend, run the following command to install the IP Lookup plugin:

```bash npm2yarn
npm install medusa-plugin-ip-lookup
```

Then, add the following environment variable in `.env`:

```bash
IPSTACK_ACCESS_KEY=<YOUR_ACCESS_KEY>
```

Where `<YOUR_ACCESS_KEY>` is your ipstack account’s access key. It’s available in your ipstack dashboard.

Finally, add the IP lookup plugin into the plugins array exported as part of the Medusa configuration in `medusa-config.js`:

```js title="medusa-config.js"
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

The plugin provides two resources: the `IpLookupService` and the `preCartCreation` middleware.

:::note

Due to how Express resolves the current IP when accessing your website from `localhost`, you won’t be able to test the plugin locally. You can either use tools like ngrok to expose the `9000` port to be accessed publicly, or you have to test it on a deployed backend.

:::

### IpLookupService

The `IpLookupService` can be used in other services, API Routes, or resources to get the user’s location by their IP address. It has only one method `lookupIp` that accepts the IP address as a parameter, sends a request to ipstack’s API, and returns the retrieved result.

For example, you can use the `IpLookupService` in a custom API Route and return the user’s region:

:::tip

You can learn more about creating an API Route [here](../../development/api-routes/create.mdx).

:::

```ts title="src/api/store/customer-region/route.ts"
import type { 
  MedusaRequest, 
  MedusaResponse, 
  RegionService,
} from "@medusajs/medusa"

export const GET = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  const ipLookupService = req.scope.resolve(
    "ipLookupService"
  )
  const regionService = req.scope.resolve<RegionService>(
    "regionService"
  )
  
  const ip = req.headers["x-forwarded-for"] || 
    req.socket.remoteAddress

  const { data } = await ipLookupService.lookupIp(ip)

  if (!data.country_code) {
    throw new Error ("Couldn't detect country code.")
  }

  const region = await regionService
  .retrieveByCountryCode(data.country_code)

  res.json({
    region,
  })
}
```

### preCartCreation

The `preCartCreation` middleware can be added as a middleware to any route to attach the region ID to that route based on the user’s location. For example, you can use it on the Create Cart API Route to ensure that the user’s correct region is attached to the cart.

For example, you can attach it to all `/store` routes to ensure the customer’s region is always detected:

<!-- eslint-disable @typescript-eslint/no-var-requires -->

```ts title="src/api/middlewares.ts"
import type { MiddlewaresConfig } from "@medusajs/medusa"
const { preCartCreation } = require(
  "medusa-plugin-ip-lookup/api/medusa-middleware"
).default

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/store/*",
      middlewares: [preCartCreation],
    },
  ],
}
```
