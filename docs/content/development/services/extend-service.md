---
description: 'Learn how to create a service in Medusa. This guide also includes how to use services in other services, subscribers, and endpoints.'
addHowToData: true
---

# How to Extend a Service

In this document, you’ll learn how to extend a core service in Medusa.

## Overview

Medusa’s core services cover a wide range of functionalities related to each domain or entity. You can extend these services to add custom methods or override existing methods.

### Word of Caution about Overriding

Extending services to add new methods shouldn't cause any issues within your commerce application. However, if you extend them to override their existing methods, you should be aware that this could have negative implications, such as unanticipated bugs, especially when you try to upgrade the core Medusa package to a newer version.

---

## Step 1: Create the Service File

In your Medusa backend, create the file `src/services/product.ts`. This file will hold your extended service.

Note that the name of the file must be the same as the name of the original service in the core package. So, if you’re extending the `ProductService`, the file’s name should be `product.ts`. On the other hand, if you’re extending the `CustomerService`, the file’s name should be `customer.ts`.

---

## Step 2: Implementing the Service

In the file, you can import the original service from the Medusa core, then create your service that extends the core service.

For example, to extend the Product service:

```ts title=src/services/product.ts
import { 
  ProductService as MedusaProductService,
} from "@medusajs/medusa"

class ProductService extends MedusaProductService {
  // TODO add customizations
}

export default ProductService
```

Notice that you alias the `ProductService` of the core to avoid naming conflicts.

Within the service, you can add new methods or extend existing ones.

You can also change the lifetime of the service:

```ts title=src/services/product.ts
import { Lifetime } from "awilix"
import { 
  ProductService as MedusaProductService,
} from "@medusajs/medusa"

class ProductService extends MedusaProductService {
  // The default life time for a core service is SINGLETON
  static LIFE_TIME = LifeTime.SCOPED
    
  // ...
}

export default ProductService
```

You can learn more details about the service lifetime and other considerations when creating a service in the [Create Service documentation](./create-service.md).

---

## Step 3: Test it Out

To test out your customization, start by transpiling your files by running the following command in the root directory of the Medusa backend:

```bash npm2yarn
npm run build
```

Then, start the backend:

```bash npm2yarn
npm run start
```

You should see the customizations you made in effect.
