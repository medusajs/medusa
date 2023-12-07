---
addHowToData: true
---

# How to Extend an API Route Validator

In this guide, you'll learn how to extend an API Route validator from the Medusa core.

## Overview

Request fields passed to API Routes defined in the Medusa core are validated to ensure that only expected fields are passed, and the passed fields are of correct types.

In some scenarios, you may need to allow passing custom fields into an existing API Route. If a custom field is passed to an API Route in the core, the API Route returns an error in the response.

To allow passing custom fields into core API Routes, you must extend Validators. Validators are classes that are used by the core to validate the request parameters to an API Route.

This guide explains how to extend a validator to allow passing custom fields to an API Route. You'll be extending the validator of the admin API Create Product route as an example.

---

## Prerequisites

This guide assumes you already have a Medusa backend installed and configured. If not, you can check out the [backend quickstart guide](../backend/install.mdx).

---

## Step 1: Create File

You can add the code to extend the validator in any file under the `src` directory of your Medusa project, but it should be executed by `src/api/index.ts`.

For example, you can add the code in an exported function defined in the file `src/api/routes/admin/products/create-product.ts`, then import that file in `src/api/index.ts` and execute the function.

For simplicity, this guide adds the code directly in `src/api/index.ts`. Make sure to create it if it's not already created.

---

## Step 2: Extend Validator

In the file you created, which in this case is `src/api/index.ts`, add the following content to extend the validator:

<!-- eslint-disable max-len -->

```ts title="src/api/index.ts"
import { registerOverriddenValidators } from "@medusajs/medusa"
import {
   AdminPostProductsReq as MedusaAdminPostProductsReq,
} from "@medusajs/medusa/dist/api/routes/admin/products/create-product"
import { IsString } from "class-validator"

class AdminPostProductsReq extends MedusaAdminPostProductsReq {
   @IsString()
   custom_field: string
}

registerOverriddenValidators(AdminPostProductsReq)
```

In this code snippet you:

1. Import the `registerOverriddenValidators` function from the `@medusajs/medusa` package. This utility function allows you to extend validators in the core.
2. Import the `AdminPostProductsReq` class from `@medusajs/medusa` as `MedusaAdminPostProductsReq` since this guide extends the Create Product API Route validator. If you're extending a different validator, make sure to import it instead.
3. Create a class `AdminPostProductsReq` that extends `MedusaAdminPostProductsReq` and adds a new field `custom_field`. Notice that the name of the class must be the same name of the validator defined in the core. `custom_field` has the type `string`. You can change the type or name of the field, or add more fields.
4. Call `registerOverriddenValidators` passing it the `AdminPostProductsReq` class you created. This will override the validator defined in the core to include the new field `custom_field` among the existing fields defined in the core.

:::tip

Validators are defined in the same file as the API Route. To find the validator you need to override, find the API Route file under `@medusajs/medusa/dist/api/routes` and import the validator in that file.

:::

---

## Step 3: Test it Out

To test out your extended validator, build and start your Medusa backend:

```bash npm2yarn
npm run build
npx medusa develop
```

Then, send a request to the API Route you extended passing it your custom fields. To test out the example in this guide, send an [authenticated request](https://docs.medusajs.com/api/admin#authentication) to the [Create Product API Route](https://docs.medusajs.com/api/admin#products_postproducts) and pass it the `custom_field` body parameter. The request should execute with no errors.
