---
title: Setting up a Next.js storefront for your Medusa project
---

# Setting up a Next.js storefront for your Medusa project

:::note

Medusa is a headless open source commerce platform giving engineers the foundation for building unique and scalable digital commerce projects through our API-first engine.
Being headless, our starters serve as a good foundation for you to get coupled with a frontend in a matter of minutes.

:::

This article assumes you already have the Medusa project created and ready to be linked to your Next.js starter.

## Getting started

In order to get started, let's open the terminal and use the following command to create an instance of your storefront:

```zsh
    npx create-next-app -e https://github.com/medusajs/nextjs-starter-medusa my-medusa-storefront
```

Now we have a storefront codebase that is ready to be used with our Medusa server.

Next, we have to complete two steps to make our new shiny storefront to speak with our server: **link storefront to a server** and **update the `STORE_CORS` variable**.

Let's jump to these two.

## Link storefront to a server

For this part, we should navigate to a `client.js` file which you can find in the utils folder.

We don't need to do much in here, but to make sure that our storefront is pointing to the port where the server is running

```js
import Medusa from "@medusajs/medusa-js"
const BACKEND_URL = process.env.GATSBY_STORE_URL || "http://localhost:9000" // <--- That is the line we are looking for
export const createClient = () => new Medusa({ baseUrl: BACKEND_URL })
```

By default, the Medusa server is running at port 9000. So if you didn't change that, we are good to go to our next step.

## Update the `STORE_CORS` variable

Here let's navigate to your Medusa server and open `medusa-config.js`

Let's locate the `STORE_CORS` variable and make sure it's the right port (which is 3000 by default for Next.js projects).

```js
/*
 * CORS to avoid issues when consuming Medusa from a client.
 * Should be pointing to the port where the storefront is running.
 */
const STORE_CORS = process.env.STORE_CORS || "http://localhost:3000"
```

Now we have a storefront that interacts with our Medusa server and with that we have a sweet and complete e-commerce setup with a Next.js storefront.
