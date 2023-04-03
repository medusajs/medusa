---
"@medusajs/inventory": patch
"medusa-core-utils": patch
"@medusajs/medusa": patch
---

feat(medusa): Modules initializer

### Loading modules in a project

Example

``` typescript
import { InventoryServiceInitializeOptions, initialize } from "@medusajs/inventory"

const options: InventoryServiceInitializeOptions = {
  database: {
    type: "postgres",
    url: DB_URL,
  },
}

const inventoryService = await initialize(options)
const newInventoryItem = await inventoryService.createInventoryItem({
  sku: "sku_123",
})
```
