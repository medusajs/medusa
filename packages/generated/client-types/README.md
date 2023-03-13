# Medusa Client Types

TypeScript types derived from the OpenAPI Spec (OAS) to be used in API clients.

The source code is generated using the `medusa-oas` CLI tooling.

## Install

`yarn add --dev @medusa/client-types`

## How to use

Import in the client.

```typescript
import type { AdminCustomersRes } from "@medusajs/client-types"
import type { Customer } from "@medusajs/client-types"
import type { StoreGetProductCategoryParams } from "@medusajs/client-types"
```