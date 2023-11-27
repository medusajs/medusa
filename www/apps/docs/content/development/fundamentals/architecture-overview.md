---
description: "Learn about Medusa's architecture and get a general overview of how all different tools work together."
---

# Medusa Architecture Overview

In this document, you'll get an overview of Medusa's architecture to better understand how all resources and tools work together.

## Architecture Overview

Medusa's core package `@medusajs/medusa` is a Node.js headless server. It combines all the [Commerce Modules](../../modules/overview.mdx) that Medusa provides. Commerce Modules are ecommerce features that can be used as building blocks in an ecommerce ecosystem. Product is an example of a Commerce Module.

![Medusa Core Architecture](https://res.cloudinary.com/dza7lstvk/image/upload/v1697706240/Medusa%20Docs/Diagrams/medusa_architecture_qvg9a3.jpg)

The backend connects to a database, such as [PostgreSQL](https://www.postgresql.org/), to store the ecommerce store’s data. The tables in that database are represented by [Entities](../entities/overview.mdx), built on top of [Typeorm](https://typeorm.io/). Entities can also be reflected in the database using [Migrations](../entities/migrations/overview.mdx).

The retrieval, manipulation, and other utility methods related to that entity are created inside a [Service](../services/overview.mdx). Services are TypeScript or JavaScript classes that, along with other resources, can be accessed throughout the Medusa backend through [dependency injection](./dependency-injection.md).

The backend doesn't have any tightly-coupled frontend. Instead, it exposes [API Routes](../api-routes/overview.mdx) which are REST APIs that frontends such as an admin or a storefront can use to communicate with the backend.

Medusa also uses an [Events Architecture](../events/index.mdx) to trigger and handle events. Events are triggered when a specific action occurs, such as when an order is placed. To manage this events system, Medusa connects to a service that implements a pub/sub model, such as [Redis](https://redis.io/).

Events can be handled using [Subscribers](../events/subscribers.mdx). Subscribers are TypeScript or JavaScript files that export a handler function that's executed asynchronously when an event is triggered, and a configuration object defining what events the subscriber listens to.

You can create any of the resources in the backend’s architecture, such as entities, API Routes, services, and more, as part of your custom development without directly modifying the backend itself. The Medusa backend uses [loaders](../loaders/overview.mdx) to load the backend’s resources, as well as your custom resources and resources in [Plugins](../plugins/overview.mdx).

You can package your customizations into Plugins to reuse them in different Medusa backends or publish them for others to use. You can also install existing plugins into your Medusa backend.
