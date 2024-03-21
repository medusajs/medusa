---
description: 'Learn how to create an inventory service, which you can use in a custom inventory module in the Medusa backend.'
addHowToData: true
---

# How to Create an Inventory Service

In this document, you’ll learn how to create an inventory service, which you can use in a custom inventory module in the Medusa backend.

## Overview

An inventory module is used in a commerce application, such as the Medusa backend, to handle functionalities related to stock-kept items. This includes managing those items, their locations, and their allocations in orders.

While Medusa provides [an inventory module](../inventory-module.md) that you can use in your Medusa backend, you can also create a custom module to handle these functionalities.

The module is expected to, at the very least, export the inventory service. If necessary, you can include entities, migrations, and other resources as part of the export.

This guide will only explain what is required to create in your custom inventory service, and not the entities or other resources, as those you have the freedom to choose how to implement. You can refer to the [Modules documentation](../../../development/modules/create.mdx) for other details on how to create and use the module.

:::note

It should be noted that the Medusa backend expects the Inventory Module to have entities for an inventory item, an inventory level, and a reservation item, as it uses the IDs of those entities when orchestrating between different modules and the in the API Routes it exposes. You can learn more about this in the [Inventory Module Architecture documentation](../inventory-module.md).

:::

---

## Prerequisites

The `IStockLocationService` interface that you’ll be implementing is available in the `@medusajs/types` package. So, make sure to install it in your Medusa backend or the module project (depending on where you’re adding your implementation):

```bash npm2yarn
npm install @medusajs/types
```

You’ll also be using decorators in your methods that are imported from the `@medusajs/utils` package, so make sure to install it as well:

```bash npm2yarn
npm install @medusajs/utils
```

---

## Step 2: Implement the Inventory Service

Create a file in the `src/services` directory that will hold your custom inventory service. For example, `src/services/inventory.ts`.

In that file, add the following content:

```ts title="src/services/inventory.ts"
import { 
  CreateInventoryItemInput, 
  CreateInventoryLevelInput, 
  CreateReservationItemInput, 
  FilterableInventoryItemProps, 
  FilterableInventoryLevelProps, 
  FilterableReservationItemProps, 
  FindConfig, 
  IInventoryService, 
  InventoryItemDTO, 
  InventoryLevelDTO, 
  ReservationItemDTO, 
  SharedContext, 
  UpdateInventoryLevelInput, 
  UpdateReservationItemInput,
} from "@medusajs/types"
import { 
  InjectEntityManager, 
  MedusaContext,
} from "@medusajs/utils"

class InventoryService implements IInventoryService {
  async listInventoryItems(
    selector: FilterableInventoryItemProps, 
    config?: FindConfig<InventoryItemDTO>, 
    context?: SharedContext
  ): Promise<[InventoryItemDTO[], number]> {
    throw new Error("Method not implemented.")
  }
  async listReservationItems(
    selector: FilterableReservationItemProps, 
    config?: FindConfig<ReservationItemDTO>, 
    context?: SharedContext
  ): Promise<[ReservationItemDTO[], number]> {
    throw new Error("Method not implemented.")
  }
  async listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config?: FindConfig<InventoryLevelDTO>,
    context?: SharedContext
  ): Promise<[InventoryLevelDTO[], number]> {
    throw new Error("Method not implemented.")
  }
  async retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>,
    context?: SharedContext
  ): Promise<InventoryItemDTO> {
    throw new Error("Method not implemented.")
  }
  async retrieveInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    context?: SharedContext
  ): Promise<InventoryLevelDTO> {
    throw new Error("Method not implemented.")
  }
  async retrieveReservationItem(
    reservationId: string,
    context?: SharedContext
  ): Promise<ReservationItemDTO> {
    throw new Error("Method not implemented.")
  }
  async createReservationItem(
    input: CreateReservationItemInput,
    context?: SharedContext
  ): Promise<ReservationItemDTO> {
    throw new Error("Method not implemented.")
  }
  async createInventoryItem(
    input: CreateInventoryItemInput, 
    context?: SharedContext
  ): Promise<InventoryItemDTO> {
    throw new Error("Method not implemented.")
  }
  async createInventoryLevel(
    data: CreateInventoryLevelInput,
    context?: SharedContext
  ): Promise<InventoryLevelDTO> {
    throw new Error("Method not implemented.")
  }
  async updateInventoryLevel(
    inventoryItemId: string,
    locationId: string, 
    update: UpdateInventoryLevelInput, 
    context?: SharedContext
  ): Promise<InventoryLevelDTO> {
    throw new Error("Method not implemented.")
  }
  async updateInventoryItem(
    inventoryItemId: string,
    input: CreateInventoryItemInput,
    context?: SharedContext
  ): Promise<InventoryItemDTO> {
    throw new Error("Method not implemented.")
  }
  async updateReservationItem(
    reservationItemId: string, 
    input: UpdateReservationItemInput, 
    context?: SharedContext
  ): Promise<ReservationItemDTO> {
    throw new Error("Method not implemented.")
  }
  async deleteReservationItemsByLineItem(
    lineItemId: string,
    context?: SharedContext
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async deleteReservationItem(
    reservationItemId: string | string[],
    context?: SharedContext
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async deleteInventoryItem(
    inventoryItemId: string, 
    context?: SharedContext
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async deleteInventoryItemLevelByLocationId(
    locationId: string, 
    context?: SharedContext
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async deleteReservationItemByLocationId(
    locationId: string, 
    context?: SharedContext
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async deleteInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    context?: SharedContext
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    context?: SharedContext
  ): Promise<InventoryLevelDTO> {
    throw new Error("Method not implemented.")
  }
  async confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number,
    context?: SharedContext
  ): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  async retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number> {
    throw new Error("Method not implemented.")
  }
  async retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number> {
    throw new Error("Method not implemented.")
  }
  async retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number> {
    throw new Error("Method not implemented.")
  }
}

export default InventoryService
```

This defines the class `StockLocationService` that implements the `IInventoryService` service imported from the `@medusajs/types` package.

The following sections explain the different methods you need to implement.

### Using Method Decorators

For each of the methods, you’ll be using the following decorators:

1. `@InjectEntityManager`: Ensures that a transaction entity manager is always passed to the method. The transaction manager is useful when performing database operations.
2. `@MedusaContext`: Used on a parameter passed to a method having the `@InjectEntityManager` decorator. It indicates which parameter should include the injected transaction manager. When used on a `context` parameter as shown below, the context is no longer optional and you can always expect the transaction manager to be passed as a parameter.

To use these decorators, it’s recommended to include the following configurations in your `tsconfig.json` file:

```json
{
  //other configurations
  "compilerOptions": {
    // other configurations
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
  }
}
```

### Implementing listInventoryItems Method

This method is used to retrieve a list of inventory items. It accepts the following parameters:

1. `selector`: This is the first parameter passed to the method, and the only required parameter. It is an object that has the following properties:
    1. `id`: an optional string or array of strings indicating the IDs of inventory items. It is used to filter the retrieved inventory items by ID.
    2. `location_id`: an optional string or array of strings indicating the IDs of locations. It is used to filter the retrieved inventory items by the ID of the associated stock location. The association is managed through the inventory level.
    3. `q`: an optional string used to search through inventory items by sku.
    4. `sku`: an optional string, array of strings, or a `StringComparisonOperator` object that is used to search and filter inventory items by their sku. The `StringComparisonOperator` can have the following properties:
        1. `lt`: indicates a string that the sku should be less than.
        2. `gt`: indicates a string that the sku should be greater than.
        3. `gte`: indicates a string that the sku should be greater than or equal to.
        4. `lte`: indicates a string the sku should be less than or equal to.
    5. `origin_country`: an optional string or array of strings indicating the origin country of inventory items. It is used to filter the retrieved inventory items by origin country.
    6. `hs_code`: an optional string or array of strings indicating the HS code of inventory items. It is used to filter the retrieved inventory items by HS code.
    7. `requires_shipping`: an optional boolean that searches through inventory items based on their `requires_shipping` attribute value.
2. `config`: This is the second parameter and it is an optional parameter. It’s an object that can have any of the following optional properties:
    1. `select`: an array of strings indicating the attributes in your inventory item entity to retrieve.
    2. `skip`: a number indicating how many location records to skip before retrieving the list.
    3. `take`: a number indicating how many location records to retrieve.
    4. `order`: an object indicating the order to retrieve the locations by. The order is specified per attribute. So, the attribute in your entity is the property of this object, and the value of the property is either `ASC` or `DESC`.
3. `context`: This is the third parameter and it’s an optional parameter. This parameter should be used to inject the transaction manager, as explained in the [Method Decorators section](#using-method-decorators). It’s an object that can have any of the following optional properties:
    1. `transactionManager`: the transaction manager to use to perform database operations.

This method is expected to return an array, with the first item being the array of inventory items, and the second item being the count. Each inventory item is an object of the following type:

```ts
type InventoryItemDTO = {
    id: string;
    sku?: string | null;
    origin_country?: string | null;
    hs_code?: string | null;
    requires_shipping: boolean;
    mid_code?: string | null;
    material?: string | null;
    weight?: number | null;
    length?: number | null;
    height?: number | null;
    width?: number | null;
    metadata?: Record<string, unknown> | null;
    created_at: string | Date;
    updated_at: string | Date;
    deleted_at: string | Date | null;
};
```

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async listInventoryItems(
    selector: FilterableInventoryItemProps, 
    config?: FindConfig<InventoryItemDTO>, 
    @MedusaContext() context?: SharedContext
  ): Promise<[InventoryItemDTO[], number]> {
    const manager = context.transactionManager!
    const inventoryItemRepo = manager.getRepository(

      CustomInventoryItem
    
    )

    // TODO retrieve and return inventory items and their count
    // for example
    return await inventoryItemRepo.findAndCount(selector)
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

### Implementing listReservationItems Method

This method is used to retrieve a list of reservation items. It accepts the same parameters as the [listInventoryItems method](#implementing-listinventoryitems-method)](#implementing-listinventoryitems-method), but the `selector` parameter has the following properties:

1. `id`: an optional string or array of strings indicating the IDs of reservation items. It is used to filter the retrieved reservation items by ID.
2. `type`: an optional string or array of strings indicating the type of reservation items. It is used to filter the retrieved reservation items by type.
3. `line_item_id`: an optional string or array of strings indicating the line item ID. It is used to filter the retrieved reservation items based on the line item they’re associated with.
4. `inventory_item_id`: an optional string or array of strings indicating the inventory item ID. It is used to filter the retrieved reservation items based on the inventory item they’re associated with.
5. `location_id`: an optional string or array of strings indicating the stock location ID. It is used to filter the retrieved reservation items based on the location they’re associated with. The association is managed through the inventory level.
6. `quantity`: an optional number or `NumericalComparisonOperator` object that is used to filter reservation items by their quantity. The `NumericalComparisonOperator` object can have any of the following properties:
    1. `lt`: indicates a number that the quantity should be less than.
    2. `gt`: indicates a number that the quantity should be greater than.
    3. `gte`: indicates a number that the quantity should be greater than or equal to.
    4. `lte`: indicates a number the quantity should be less than or equal to.

This method is expected to return an array, with the first item being an array of reservation items, and the second item being their count. Each reservation item is an object of the following type:

```ts
type ReservationItemDTO = {
    id: string;
    location_id: string;
    inventory_item_id: string;
    quantity: number;
    line_item_id?: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string | Date;
    updated_at: string | Date;
    deleted_at: string | Date | null;
};
```

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async listReservationItems(
    selector: FilterableReservationItemProps, 
    config?: FindConfig<ReservationItemDTO>, 
    @MedusaContext() context?: SharedContext
  ): Promise<[ReservationItemDTO[], number]> {
    const manager = context.transactionManager!
    const reservationItemRepo = manager.getRepository(
      CustomReservationItem
    )

    // TODO retrieve and return reservation items 
    // and their count
    // for example
    return await reservationItemRepo.findAndCount(selector)
  }
}
```

Make sure to replace `CustomReservationItem` with your reservation item entity.

### Implementing listInventoryLevels Method

This method is used to retrieve a list of inventory levels. It accepts the same parameters as the [listInventoryItems method](#implementing-listinventoryitems-method), but the `selector` parameter has the following properties:

1. `inventory_item_id`: an optional string or array of strings indicating the IDs of inventory items. It is used to filter the retrieved location levels by their associated inventory items.
2. `location_id`: an optional string or array of strings indicating the stock location ID. It is used to filter the retrieved inventory level based on the stock location they’re associated with.
3. `stocked_quantity`: an optional number or `NumericalComparisonOperator` object that is used to filter reservation items by their stocked quantity. The `NumericalComparisonOperator` object can have any of the following properties:
    1. `lt`: indicates a number that the quantity should be less than.
    2. `gt`: indicates a number that the quantity should be greater than.
    3. `gte`: indicates a number that the quantity should be greater than or equal to.
    4. `lte`: indicates a number the quantity should be less than or equal to.
4. `reserved_quantity`: an optional number or `NumericalComparisonOperator` object that is used to filter reservation items by their reserved quantity.
5. `incoming_quantity`: an optional number or `NumericalComparisonOperator` object that is used to filter reservation items by their incoming quantity.

This method is expected to return an array, with the first item being an array of reservation items, and the second item being their count. Each reservation item is an object of the following type:

```ts
type InventoryLevelDTO = {
    id: string;
    inventory_item_id: string;
    location_id: string;
    stocked_quantity: number;
    reserved_quantity: number;
    incoming_quantity: number;
    metadata: Record<string, unknown> | null;
    created_at: string | Date;
    updated_at: string | Date;
    deleted_at: string | Date | null;
}
```

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config?: FindConfig<InventoryLevelDTO>,
    @MedusaContext() context?: SharedContext
  ): Promise<[InventoryLevelDTO[], number]> {
    const manager = context.transactionManager!
    const inventoryLevelRepo = manager.getRepository(
      CustomInventoryLevel
    )

    // TODO retrieve and return inventory levels
    // for example
    return await inventoryLevelRepo.findAndCount(selector)
  }
}
```

Make sure to replace `CustomInventoryLevel` with your inventory level entity.

### Implementing retrieveInventoryItem Method

This method is used to retrieve a single inventory item. It accepts the following parameters:

1. `inventoryItemId`: The first parameter and it’s required. It’s the ID of the inventory item to retrieve.
2. `config`: The second parameter and it’s optional. It’s the same `config` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).
3. `context`: The third parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the inventory item as an object.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>,
    @MedusaContext() context?: SharedContext
  ): Promise<InventoryItemDTO> {
    const manager = context.transactionManager!
    const inventoryItemRepo = manager.getRepository(
      CustomInventoryItem
    )

    // TODO retrieve and return inventory item
    // for example
    const [item] = await inventoryItemRepo.find({
      id: inventoryItemId,
    })

    return item
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

### Implementing retrieveInventoryLevel Method

This method is used to retrieve a single inventory level. It accepts the following parameters:

1. `inventoryItemId`: The first parameter and it’s required. It’s the ID of the inventory item that the inventory level is associated with.
2. `locationId`: The second parameter and it’s required. It’s the ID of the stock location that the inventory level is associated with.
3. `context`: The third parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the inventory level as an object.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async retrieveInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    @MedusaContext() context?: SharedContext
  ): Promise<InventoryLevelDTO> {
    const manager = context.transactionManager!
    const inventoryLevelRepo = manager.getRepository(
      CustomInventoryLevel
    )

    // TODO retrieve and return inventory level
    // for example
    const [level] = await inventoryLevelRepo.find({
      inventory_item_id: inventoryItemId,
      location_id: locationId,
    })

    return level
  }
}
```

Make sure to replace `CustomInventoryLevel` with your inventory level entity.

### Implementing retrieveReservationItem Method

This method is used to retrieve a single reservation item. It accepts the following parameters:

1. `reservationId`: The first parameter and it’s required. It’s the ID of the inventory item that the inventory level is associated with.
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the inventory level as an object.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async retrieveReservationItem(
    reservationId: string,
    @MedusaContext() context?: SharedContext
  ): Promise<ReservationItemDTO> {
    const manager = context.transactionManager!
    const reservationItemRepo = manager.getRepository(
      CustomReservationItem
    )

    // TODO retrieve and return reservation item
    // for example
    const [item] = await reservationItemRepo.find({
      id: reservationId,
    })

    return item
  }
}
```

Make sure to replace `CustomReservationItem` with your reservation item entity.

### Implementing createReservationItem Method

This method is used to create a reservation item. It accepts the following parameters:

1. `input`: It’s the first parameter and it’s required. It’s an object having the following properties:
    1. `inventory_item_id`: (required) the ID of the inventory item this reservation item is associated with.
    2. `location_id`: (required) the ID of the stock location this reservation item is associated with.
    3. `line_item_id`: the ID of the line item this reservation item is associated with.
    4. `quantity`: (required) the quantity to be reserved.
    5. `metadata`: an object used to set the `metadata` attribute of the reservation item.
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the newly created reservation item.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async createReservationItem(
    input: CreateReservationItemInput,
    @MedusaContext()context?: SharedContext
  ): Promise<ReservationItemDTO> {
    const manager = context.transactionManager!
    const reservationItemRepo = manager.getRepository(
      CustomReservationItem
    )

    // TODO create reservation item
    // for example
    return await reservationItemRepo.create(input)
  }
}
```

Make sure to replace `CustomReservationItem` with your reservation item entity.

### Implementing createInventoryItem Method

This method is used to create an inventory item. It accepts the following parameters:

1. `input`: It’s the first parameter and it’s required. It’s an object having the necessary properties for the inventory item entity such as `sku`, `origin_country`, etc…
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the newly created inventory item.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async createInventoryItem(
    input: CreateInventoryItemInput, 
    @MedusaContext() context?: SharedContext
  ): Promise<InventoryItemDTO> {
    const manager = context.transactionManager!
    const customInventoryItem = manager.getRepository(
      CustomInventoryItem
    )

    // TODO create inventory item
    // for example
    return await customInventoryItem.create(input)
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

### Implementing createInventoryLevel Method

This method is used to create an inventory level. It accepts the following parameters:

1. `data`: It’s the first parameter and it’s required. It’s an object having the following properties:
    1. `inventory_item_id`: (required) the ID of the inventory item this inventory level is associated with.
    2. `location_id`: (required) the ID of the stock location this inventory level is associated with.
    3. `stocked_quantity`: (required) the item’s quantity in stock in this location.
    4. `reserved_quantity`: the item’s reserved quantity in this location.
    5. `incoming_quantity`: the item’s incoming quantity in this location.
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the newly created inventory level.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async createInventoryLevel(
    data: CreateInventoryLevelInput,
    @MedusaContext() context?: SharedContext
  ): Promise<InventoryLevelDTO> {
    const manager = context.transactionManager!
    const customInventoryLevel = manager.getRepository(
      CustomInventoryLevel
    )

    // TODO create inventory level
    // for example
    return await customInventoryLevel.create(data)
  }
}
```

Make sure to replace `CustomInventoryLevel` with your inventory level entity.

### Implementing updateReservationItem Method

This method is used to update a reservation item. It accepts the following parameters:

1. `reservationItemId`: it’s the first parameter and it’s required. It’s the ID of the reservation item to update.
2. `input`: It’s the second parameter and it’s required. It’s an object having any of the reservation item’s attributes to update as a property, with their new value as the property’s value. For example, `quantity`.
3. `context`: The third parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the updated reservation item.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async updateReservationItem(
    reservationItemId: string, 
    input: UpdateReservationItemInput, 
    @MedusaContext() context?: SharedContext
  ): Promise<ReservationItemDTO> {
    const manager = context.transactionManager!
    const customReservationItem = manager.getRepository(
      CustomReservationItem
    )

    // TODO update reservation item
    // for example
    await customReservationItem.update({
      id: reservationItemId,
    }, input)

    return await this.retrieveReservationItem(
      reservationItemId,
      context
    )
  }
}
```

Make sure to replace `CustomReservationItem` with your reservation item entity.

### Implementing updateInventoryItem Method

This method is used to update an inventory item. It accepts the following parameters:

1. `inventoryItemId`: it’s the first parameter and it’s required. It’s the ID of the inventory item to update.
2. `input`: It’s the second parameter and it’s required. It’s an object having any of the inventory item’s attributes to update as a property, with their new value as the property’s value. For example, `sku`.
3. `context`: The third parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the updated inventory item.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async updateInventoryItem(
    inventoryItemId: string,
    input: CreateInventoryItemInput,
    @MedusaContext() context?: SharedContext
  ): Promise<InventoryItemDTO> {
    const manager = context.transactionManager!
    const customInventoryItem = manager.getRepository(
      CustomInventoryItem
    )

    // TODO update inventory item
    // for example
    await customInventoryItem.update(
      {
        id: inventoryItemId,
      }, 
      input
    )

    return await this.retrieveInventoryItem(
      inventoryItemId, 
      {}, 
      context
    )
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

### Implementing updateInventoryLevel Method

This method is used to update a inventory level. It accepts the following parameters:

1. `inventoryItemId`: it’s the first parameter and it’s required. It’s the ID of the inventory item associated with the inventory level to update.
2. `locationId`: it’s the second parameter and it’s required. It’s the ID of the stock location associated with the inventory level to update.
3. `update`: It’s the third parameter and it’s required. It’s an object having any of the inventory level’s attributes to update as a property, with their new value as the property’s value. For example, `stocked_quantity`.
4. `context`: The fourth parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the updated inventory level.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async updateInventoryLevel(
    inventoryItemId: string,
    locationId: string, 
    update: UpdateInventoryLevelInput, 
    @MedusaContext() context?: SharedContext
  ): Promise<InventoryLevelDTO> {
    const manager = context.transactionManager!
    const customInventoryLevel = manager.getRepository(
      CustomInventoryLevel
    )

    // TODO create inventory level
    // for example
    await customInventoryLevel.update({
      inventory_item_id: inventoryItemId,
      location_id: locationId,
    }, update)

    return await this.retrieveInventoryLevel(
      inventoryItemId,
      locationId,
      context
    )
  }
}
```

Make sure to replace `CustomInventoryLevel` with your inventory level entity.

### Implementing deleteReservationItem Method

This method is used to delete a reservation item. It accepts the following parameters:

1. `reservationItemId`: it’s the first parameter and it’s required. It’s the ID of the reservation item to delete. It can be a string, indicating that one reservation item should be deleted, or an array of strings, indicating that more than one item should be deleted.
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is not expected to return anything.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async deleteReservationItem(
    reservationItemId: string | string[],
    @MedusaContext() context?: SharedContext
  ): Promise<void> {
    const manager = context.transactionManager!
    const customReservationItem = manager.getRepository(
      CustomReservationItem
    )

    // TODO delete reservation item
    // for example
    await customReservationItem.delete(reservationItemId)
  }
}
```

Make sure to replace `CustomReservationItem` with your reservation item entity.

### Implementing deleteReservationItemsByLineItem Method

This method is used to delete reservation items associated with a line item. It accepts the following parameters:

1. `lineItemId`: it’s the first parameter and it’s required. It’s the ID of the line item that the reservation items should be associated with to delete.
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is not expected to return anything.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async deleteReservationItemsByLineItem(
    lineItemId: string,
    @MedusaContext() context?: SharedContext
  ): Promise<void> {
    const manager = context.transactionManager!
    const customReservationItem = manager.getRepository(
      CustomReservationItem
    )

    // TODO delete reservation item
    // for example
    await customReservationItem.delete({
      line_item_id: lineItemId,
    })
  }
}
```

Make sure to replace `CustomReservationItem` with your reservation item entity.

### Implementing deleteReservationItemByLocationId Method

This method is used to delete reservation items associated with a stock location. It accepts the following parameters:

1. `locationId`: it’s the first parameter and it’s required. It’s the ID of the stock location that the reservation items should be associated with to be deleted.
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is not expected to return anything.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async deleteReservationItemByLocationId(
    locationId: string, 
    @MedusaContext() context?: SharedContext
  ): Promise<void> {
    const manager = context.transactionManager!
    const customReservationItem = manager.getRepository(
      CustomReservationItem
    )

    // TODO delete reservation item
    // for example
    await customReservationItem.delete({
      location_id: locationId,
    })
  }
}
```

Make sure to replace `CustomReservationItem` with your reservation item entity.

### Implementing deleteInventoryItem Method

This method is used to delete an inventory item. It accepts the following parameters:

1. `inventoryItemId`: it’s the first parameter and it’s required. It’s the ID of the inventory item to delete.
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is not expected to return anything.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async deleteInventoryItem(
    inventoryItemId: string, 
    @MedusaContext() context?: SharedContext
  ): Promise<void> {
    const manager = context.transactionManager!
    const customInventoryItem = manager.getRepository(
      CustomInventoryItem
    )

    // TODO delete inventory item
    // for example
    await customInventoryItem.delete(inventoryItemId)
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

### Implementing deleteInventoryLevel Method

This method is used to delete an inventory level. It accepts the following parameters:

1. `inventoryItemId`: it’s the first parameter and it’s required. It’s the ID of the inventory item that the inventory level should be associated with to be deleted.
2. `locationId`: it’s the second parameter and it’s required. It’s the ID of the stock location that the inventory level should be associated with to be deleted.
3. `context`: The third parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is not expected to return anything.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async deleteInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    @MedusaContext() context?: SharedContext
  ): Promise<void> {
    const manager = context.transactionManager!
    const customInventoryLevel = manager.getRepository(
      CustomInventoryLevel
    )

    // TODO delete inventory level
    // for example
    await customInventoryLevel.delete({
      inventory_item_id: inventoryItemId,
      location_id: locationId,
    })
  }
}
```

Make sure to replace `CustomInventoryLevel` with your inventory level entity.

### Implementing deleteInventoryItemLevelByLocationId Method

This method is used to delete inventory levels associated with a location. It accepts the following parameters:

1. `locationId`: it’s the first parameter and it’s required. It’s the ID of the stock location that the inventory levels should be associated with to be deleted.
2. `context`: The second parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is not expected to return anything.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async deleteInventoryItemLevelByLocationId(
    locationId: string, 
    @MedusaContext() context?: SharedContext
  ): Promise<void> {
    const manager = context.transactionManager!
    const customInventoryLevel = manager.getRepository(
      CustomInventoryLevel
    )

    // TODO delete inventory levels
    // for example
    await customInventoryLevel.delete({
      location_id: locationId,
    })
  }
}
```

Make sure to replace `CustomInventoryLevel` with your inventory level entity.

### Implementing adjustInventory Method

This method is used to adjust the quantity of an inventory item in a location. It accepts the following parameters:

1. `inventoryItemId`: It’s the first parameter and it’s required. It’s the ID of the inventory item that its quantity should be adjusted.
2. `locationId`: It’s the second parameter and it’s required. It’s the ID of the location that the inventory item’s quantity should be adjusted in. The relation with the location is done through the inventory level.
3. `adjustment`: It’s the third parameter and it’s required. It’s a number indicating how much should the quantity be increased or decreased. If the number is a positive number, then the quantity should be incremented by that number. If it’s a negative number, then the quantity should be decremented by that number.
4. `context`: The fourth parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return the updated location level.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    @MedusaContext()context?: SharedContext
  ): Promise<InventoryLevelDTO> {
    const manager = context.transactionManager!
    const customInventoryLevel = manager.getRepository(
      CustomInventoryLevel
    )

    // TODO adjust inventory level
    // for example
    const level = await this.retrieveInventoryLevel(
      inventoryItemId, 
      locationId,
      context
    )
    customInventoryLevel.update({
      inventory_item_id: inventoryItemId,
      location_id: locationId,
    }, {
      stocked_quantity: level.stocked_quantity + adjustment,
    })

    return await this.retrieveInventoryLevel(
      inventoryItemId, 
      locationId, 
      context
    )
  }
}
```

Make sure to replace `CustomInventoryLevel` with your inventory level entity.

### Implementing confirmInventory Method

This method is used to confirm whether an inventory item is available in stock. It accepts the following parameters:

1. `inventoryItemId`: It’s the first parameter and it’s required. It’s the ID of the inventory item to confirm its availability.
2. `locationIds`: It’s the second parameter and it’s required. It’s an array of location IDs used to check the inventory item’s availability in them.
3. `quantity`: It’ the third parameter and it’s required. It’s the required quantity of the inventory item.
4. `context`: The fourth parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return a boolean value indicating whether the inventory item is in stock.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number,
    @MedusaContext() context?: SharedContext
  ): Promise<boolean> {
    const manager = context.transactionManager!
    const customInventoryItem = manager.getRepository(
      CustomInventoryItem
    )

    // TODO confirm inventory item's availability
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

### Implementing retrieveAvailableQuantity Method

This method is used to retrieve the available quantity of an inventory item. You’re expected to subtract the reserved quantity from the stocked quantity in this method.

This method accepts the following parameters:

1. `inventoryItemId`: It’s the first parameter and it’s required. It’s the ID of the inventory item to retrieve its available quantity.
2. `locationIds`: It’s the second parameter and it’s required. It’s an array of location IDs used to retrieve the inventory item’s available quantity in them.
3. `context`: The third parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return a number being the available quantity of the item.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context?: SharedContext
  ): Promise<number> {
    const manager = context.transactionManager!
    const customInventoryItem = manager.getRepository(
      CustomInventoryItem
    )

    // TODO retrieve inventory item's available quantity
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

### Implementing retrieveStockedQuantity Method

This method is used to retrieve the stocked quantity of an inventory item. It accepts the following parameters:

1. `inventoryItemId`: It’s the first parameter and it’s required. It’s the ID of the inventory item to retrieve its stocked quantity.
2. `locationIds`: It’s the second parameter and it’s required. It’s an array of location IDs used to retrieve the inventory item’s stocked quantity in them.
3. `context`: The third parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return a number being the stocked quantity of the item.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context?: SharedContext
  ): Promise<number> {
    const manager = context.transactionManager!
    const customInventoryItem = manager.getRepository(
      CustomInventoryItem
    )

    // TODO retrieve inventory item's stocked quantity
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

### Implementing retrieveReservedQuantity Method

This method is used to retrieve the reserved quantity of an inventory item. It accepts the following parameters:

1. `inventoryItemId`: It’s the first parameter and it’s required. It’s the ID of the inventory item to retrieve its reserved quantity.
2. `locationIds`: It’s the second parameter and it’s required. It’s an array of location IDs used to retrieve the inventory item’s reserved quantity in them.
3. `context`: The third parameter and it’s optional. It’s the same `context` parameter passed to the [listInventoryItems method](#implementing-listinventoryitems-method).

This method is expected to return a number being the reserved quantity of the item.

For example:

```ts title="src/services/inventory.ts"
class InventoryService implements IInventoryService {
  // ...
  @InjectEntityManager()
  async retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context?: SharedContext
  ): Promise<number> {
    const manager = context.transactionManager!
    const customInventoryItem = manager.getRepository(
      CustomInventoryItem
    )

    // TODO retrieve inventory item's stocked quantity
  }
}
```

Make sure to replace `CustomInventoryItem` with your inventory item entity.

---

## Step 2: Use the Inventory Service

After implementing your custom service along with any other necessary resources, you can test it out or use it in your Medusa backend. You can learn more about how to do that in the [Create Module documentation](../../../development/modules/create.mdx).

---

## See Also

- [Inventory module architecture](../inventory-module.md)
- [How to create a stock location service](./create-stock-location-service.md)
