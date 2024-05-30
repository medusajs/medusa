---
description: 'Learn how to create a stock location service, which you can use in a custom stock location module in the Medusa backend.'
addHowToData: true
---

# How to Create a Stock Location Service

In this document, you’ll learn how to create a stock location service, which you can use in a custom stock location module in the Medusa backend.

## Overview

A stock location module is used in a commerce application, such as the Medusa backend, to handle functionalities related to the different locations a stock-kept item can be located in.

While Medusa provides a [stock-location module](../stock-location-module.md) that you can use in your Medusa backend, you can also create a custom module to handle these functionalities.

The module is expected to, at the very least, export the stock-location service. If necessary, you can include entities, migrations, and other resources as part of the export.

This guide will only explain what is required to create in your custom stock location service, and not the entities or other resources, as those you have the freedom to choose how to implement. You can refer to the [Modules documentation](../../../development/modules/create.mdx) for other details on how to create and use the module.

:::note

It should be noted that the Medusa backend expects the Stock Location Module to have entities for a location and a location address, as it uses the IDs of those entities when orchestrating between different modules and the in the API Routes it exposes. You can learn more about this in the [Stock Location Module Architecture documentation](../stock-location-module.md).

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

## Step 1: Implement the Stock Location Service

Create a file in the `src/services` directory that will hold your custom stock location service. For example, `src/services/stock-location.ts`.

In that file, add the following content:

```ts title="src/services/stock-location.ts"
import { 
  CreateStockLocationInput,
  FilterableStockLocationProps,
  FindConfig,
  IStockLocationService,
  SharedContext,
  StockLocationDTO,
  UpdateStockLocationInput,
} from "@medusajs/types"
import { 
  InjectEntityManager,
  MedusaContext,
} from "@medusajs/utils"

class StockLocationService implements IStockLocationService {
  async list(
    selector: FilterableStockLocationProps, 
    config?: FindConfig<StockLocationDTO> | undefined, 
    context?: SharedContext | undefined
  ): Promise<StockLocationDTO[]> {
    throw new Error("Method not implemented.")
  }
  async listAndCount(
    selector: FilterableStockLocationProps, 
    config?: FindConfig<StockLocationDTO> | undefined, 
    context?: SharedContext | undefined
  ): Promise<[StockLocationDTO[], number]> {
    throw new Error("Method not implemented.")
  }
  async retrieve(
    id: string, 
    config?: FindConfig<StockLocationDTO> | undefined, 
    context?: SharedContext | undefined
  ): Promise<StockLocationDTO> {
    throw new Error("Method not implemented.")
  }
  async create(
    input: CreateStockLocationInput, 
    context?: SharedContext | undefined
  ): Promise<StockLocationDTO> {
    throw new Error("Method not implemented.")
  }
  async update(
    id: string, 
    input: UpdateStockLocationInput, 
    context?: SharedContext | undefined
  ): Promise<StockLocationDTO> {
    throw new Error("Method not implemented.")
  }
  async delete(
    id: string, 
    context?: SharedContext | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default StockLocationService
```

This defines the class `StockLocationService` that implements the `IStockLocationService` service imported from the `@medusajs/types` package.

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

### Implementing list Method

The `list` method is used to retrieve a list of stock locations. It accepts the following parameters:

1. `selector`: This is the first parameter passed to the method, and the only required parameter. It is an object that has the following properties:
    1. `id`: an optional string or array of strings indicating the IDs of locations. It is used to filter the retrieved locations by ID.
    2. `name`: an optional string, array of strings, or a `StringComparisonOperator` object that is used to search and filter locations by their name. The `StringComparisonOperator` can have the following properties:
        1. `lt`: indicates a string that the name should be less than.
        2. `gt`: indicates a string that the name should be greater than.
        3. `gte`: indicates a string that the name should be greater than or equal to.
        4. `lte`: indicates a string the name should be less than or equal to.
2. `config`: This is the second parameter and it is an optional parameter. It’s an object that can have any of the following optional properties:
    1. `select`: an array of strings indicating the attributes in your location entity to retrieve.
    2. `skip`: a number indicating how many location records to skip before retrieving the list.
    3. `take`: a number indicating how many location records to retrieve.
    4. `order`: an object indicating the order to retrieve the locations by. The order is specified per attribute. So, the attribute in your entity is the property of this object, and the value of the property is either `ASC` or `DESC`.
3. `context`: This is the third parameter and it’s an optional parameter. This parameter should be used to inject the transaction manager, as explained in the [Method Decorators section](#using-method-decorators). It’s an object that can have any of the following optional properties:
    1. `transactionManager`: the transaction manager to use to perform database operations.

This method is expected to return an array of objects of the following type:

```ts
type StockLocationDTO = {
    id: string;
    name: string;
    metadata: Record<string, unknown> | null;
    address_id: string;
    address?: StockLocationAddressDTO;
    created_at: string | Date;
    updated_at: string | Date;
    deleted_at: string | Date | null;
}
```

Here’s an example implementation of the method:

```ts title="src/services/stock-location.ts"
class StockLocationService implements IStockLocationService {
  // ...
  @InjectEntityManager()
  async list(
    selector: FilterableStockLocationProps, 
    config?: FindConfig<StockLocationDTO> | undefined, 
    @MedusaContext() context?: SharedContext | undefined
  ): Promise<StockLocationDTO[]> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(
      CustomStockLocation
    )

    // TODO retrieve and return locations
    // for example
    return await locationRepo.find(selector)
  }
}
```

This example shows how you can use the context to retrieve the transaction manager, then retrieve your repository that you will use to retrieve and return locations. Make sure to replace `CustomStockLocation` with your stock location entity.

### Implementing listAndCount Method

This method is similar to the list method, but it returns both the list of locations and a count of the locations.

It accepts the exact same parameters as the [list method](#implementing-list-method), but expects to return an array of two items. The first one being the list of locations, and the second one being the count of locations.

Here’s an example implementation of the method:

```ts title="src/services/stock-location.ts"
class StockLocationService implements IStockLocationService {
  // ...
  @InjectEntityManager()
  async listAndCount(
    selector: FilterableStockLocationProps, 
    config?: FindConfig<StockLocationDTO> | undefined, 
    @MedusaContext() context?: SharedContext | undefined
  ): Promise<[StockLocationDTO[], number]> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(
      CustomStockLocation
    )

    // TODO retrieve and return locations
    // for example
    return await locationRepo.findAndCount(selector)
  }
}
```

Make sure to replace `CustomStockLocation` with your stock location entity.

### Implementing retrieve Method

This method is used to retrieve a single location. It accepts the following parameters:

1. `id`: this is the first parameter and is required. It’s a string indicating the ID of the location to retrieve.
2. `config`: This is the second parameter and an optional parameter. It’s an object having the same properties as the `config` parameter mentioned in the [list method](#implementing-list-method).
3. `context`: This is the third parameter and an optional parameter. It’s of the same type as the `context` parameter mentioned in the [list method](#implementing-list-method).

This method returns the location as an object.

For example:

```ts title="src/services/stock-location.ts"
class StockLocationService implements IStockLocationService {
  // ...
  @InjectEntityManager()
  async retrieve(
    id: string, 
    config?: FindConfig<StockLocationDTO> | undefined, 
    @MedusaContext() context?: SharedContext | undefined
  ): Promise<StockLocationDTO> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(
      CustomStockLocation
    )

    // TODO retrieve the location using its ID
    // for example
    const [location] = await locationRepo.find({
      id,
    })
    return location
  }
}
```

Make sure to replace `CustomStockLocation` with your stock location entity.

### Implementing create Method

This method is used to create a new location. It accepts the following parameters:

1. `input`: This is the first parameter, and it’s required. It's an object holding the following properties:
    1. `name`: this property is required, and its value is the name of the location.
    2. `address_id`: this property is optional, and it’s the ID of the address to associate with this location.
    3. `address`: this property is optional, and it’s an object holding address properties including `address_1`, `country_code`, `city`, and more.
    4. `metadata`: this property is optional, and it’s an object that should be stored in the `metadata` attribute of the created location.
2. `context`: This is the second parameter and an optional parameter. It’s of the same type as the `context` parameter mentioned in the [list method](#implementing-list-method).

The method is expected to return the created location as an object.

For example:

```ts title="src/services/stock-location.ts"
class StockLocationService implements IStockLocationService {
  // ...
  @InjectEntityManager()
  async create(
    input: CreateStockLocationInput, 
    @MedusaContext() context?: SharedContext | undefined
  ): Promise<StockLocationDTO> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(
      CustomStockLocation
    )
    
    // TODO create the location and return it
    // for example
    return await locationRepo.create(input)
  }
}
```

Make sure to replace `CustomStockLocation` with your stock location entity.

### Implementing update Method

This method is used to update a location by its ID. It accepts the following parameters:

1. `id`: this is the first parameter and is required. It’s a string indicating the ID of the location to update.
2. `input`: this is the second parameter and is required. It’s an object having any of the following optional properties:
    1. `name`: a string indicating the name of the location.
    2. `address_id`: the ID of the address to associate with this location.
    3. `address`: an object holding address properties including `address_1`, `country_code`, `city`, and more.
    4. `metadata`: an object that should be stored in the `metadata` attribute of the created location.
3. `context`: This is the third parameter and an optional parameter. It’s of the same type as the `context` parameter mentioned in the [list method](#implementing-list-method).

This method is expected to return the updated location object.

For example:

```ts title="src/services/stock-location.ts"
class StockLocationService implements IStockLocationService {
  // ...
  @InjectEntityManager()
  async update(
    id: string, 
    input: UpdateStockLocationInput, 
    @MedusaContext() context?: SharedContext | undefined
  ): Promise<StockLocationDTO> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(
      CustomStockLocation
    )
    
    // TODO update the location and return it
    // for example
    await locationRepo.update(id, input)
    return await this.retrieve(id)
  }
}
```

Make sure to replace `CustomStockLocation` with your stock location entity.

### Implementing delete Method

This method is used to delete a location by its ID. It accepts the following parameters:

1. `id`: this is the first parameter and is required. It’s a string indicating the ID of the location to delete.
2. `context`: This is the second parameter and an optional parameter. It’s of the same type as the `context` parameter mentioned in the [list method](#implementing-list-method).

This method is not expected to return anything.

For example:

```ts title="src/services/stock-location.ts"
class StockLocationService implements IStockLocationService {
  // ...
  @InjectEntityManager()
  async delete(
    id: string, 
    @MedusaContext() context?: SharedContext | undefined
  ): Promise<void> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(
      CustomStockLocation
    )
    
    // TODO delete the location
    // for example
    await locationRepo.delete(id)
  }
}
```

Make sure to replace `CustomStockLocation` with your stock location entity.

---

## Step 2: Use the Stock Location Service

After implementing your custom service along with any other necessary resources, you can test it out or use it in your Medusa backend. You can learn more about how to do that in the [Create Module documentation](../../../development/modules/create.mdx).

---

## See Also

- [How to create an inventory service](./create-inventory-service.md)
- [Stock location module architecture](../stock-location-module.md)
