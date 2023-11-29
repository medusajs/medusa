---
description: 'Learn how to create a search service in Medusa. You can create the search service directly in your Medusa backend codebase, in a plugin, or in a module.'
addHowToData: true
---

# How to Create a Search Service

In this document, you’ll learn how to create a search service in Medusa. You can create the search service directly in your Medusa backend codebase, in a plugin, or in a module.

## Prerequisites

### Medusa Utils Package

A search service must extend the `AbstractSearchService` class imported from the `@medusajs/utils` package. If you don’t already have the package installed, run the following command to install it within your project:

```bash npm2yarn
npm install @medusajs/utils
```

---

## Step 1: Create Search Service Class

A search service class should be defined in a TypeScript or JavaScript file created in the `src/services` directory. The class must extend the `AbstractSearchService` class imported from the `@medusajs/utils` package.

Based on services’ naming conventions, the file’s name should be the slug version of the search service’s name without `service`, and the class’s name should be the pascal case of the search service’s name following by `Service`.

For example, if you’re creating an algolia search service, the file name would be `algolia.ts`, whereas the class name would be `AlgoliaService`.

:::note

You can learn more about services and their naming convention in [this documentation](../services/overview.mdx).

:::

For example, create the file `src/services/my-search.ts` with the following content:

```ts title="src/services/my-search.ts"
import { AbstractSearchService } from "@medusajs/utils"

class MySearchService extends AbstractSearchService {
  isDefault = false
  
  createIndex(indexName: string, options: Record<string, any>) {
    throw new Error("Method not implemented.")
  }
  getIndex(indexName: string) {
    throw new Error("Method not implemented.")
  }
  addDocuments(
    indexName: string,
    documents: Record<string, any>[],
    type: string
  ) {
    throw new Error("Method not implemented.")
  }
  replaceDocuments(
    indexName: string,
    documents: Record<string, any>[],
    type: string
  ) {
    throw new Error("Method not implemented.")
  }
  deleteDocument(
    indexName: string,
    document_id: string | number
  ) {
    throw new Error("Method not implemented.")
  }
  deleteAllDocuments(indexName: string) {
    throw new Error("Method not implemented.")
  }
  search(
    indexName: string,
    query: string, 
    options: Record<string, any>
  ) {
    return {
      message: "test",
    }
  }
  updateSettings(
    indexName: string, 
    settings: Record<string, any>
  ) {
    throw new Error("Method not implemented.")
  }

}

export default MySearchService
```

This creates the service `MySearchService` which, at the moment, adds a general implementation of the methods defined in the abstract class `AbstractSearchService`.

### Using a Constructor

You can use a constructor to access services and resources registered in the dependency container, to define any necessary clients if you’re integrating a third-party storage service, and to access plugin options if your search service is defined in a plugin.

For example:

<!-- eslint-disable prefer-rest-params -->

```ts title="src/services/my-search.ts"
// ...
import { ProductService } from "@medusajs/medusa"

type InjectedDependencies = {
  productService: ProductService
}

class MySearchService extends AbstractSearchService {
  // ...
  protected readonly productService_: ProductService

  constructor({ productService }: InjectedDependencies) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.productService_ = productService
  }

  // ...
}
```

You can access the plugin options in the second parameter passed to the constructor:

<!-- eslint-disable prefer-rest-params -->

```ts title="src/services/my-search.ts"
// ...

class MySearchService extends AbstractSearchService {
  // ...
  protected readonly pluginOptions: Record<string, any>

  constructor({
    productService,
  }: InjectedDependencies, pluginOptions) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    
    // ...
    this.pluginOptions = pluginOptions
  }

  // ...
}
```

### isDefault Property

The `isDefault` property is mainly used to pinpoint the default search service defined in the Medusa core. For custom search services, the `isDefault` property should be `false`.

---

## Step 2: Implement Required Methods

In this section, you’ll learn about the required methods to implement in the search service.

:::note

The Medusa backend mainly uses the `addDocuments`, `deleteDocument`, and `search` methods in different scenarios that are explained for each of the methods. Other methods can be helpful based on the search engine you’re integrating.

:::

### createIndex

This method is used to create an index in the search engine.

The method accepts two parameters:

1. `indexName`: this is the first parameter, and it’s a string indicating the name of the index to create.
2. `options`: this is the second parameter is typically an object, and it can be used to pass any necessary options to the method. This parameter does not have any defined format.

The method does not require any specific data type to be returned.

An example implementation, assuming `client_` would interact with a third-party service:

```ts title="src/services/my-search.ts"
class MySearchService extends AbstractSearchService {
  // ...

  createIndex(indexName: string, options: Record<string, any>) {
    return this.client_.initIndex(indexName)
  }
}
```

### getIndex

This method is used to retrieve an index’s results from the search engine.

The method accepts one parameter, which is a string indicating the name of the index. The method does not require any specific data type to be returned.

An example implementation, assuming `client_` would interact with a third-party service:

```ts title="src/services/my-search.ts"
class MySearchService extends AbstractSearchService {
  // ...

  getIndex(indexName: string) {
    return this.client_.getIndex(indexName)
  }
}
```

### addDocuments

This method is used to add a document to an index in the search engine.

This method is used when the Medusa backend loads, indexing all products available in the Medusa backend. It’s also used whenever a new product is added or a product is updated.

The method accepts the following parameters:

- `indexName`: the first parameter is a string indicating the name of the index to add the document to.
- `documents`: the second parameter is typically an array of objects to index. For example, it can be an array of products to index.
- `type`: the third parameter is a string indicating the type of object being indexed. For example, when indexing products, the type would be `products`.

The method should return the response of saving the documents in the search engine, but there’s no required format of the response.

An example implementation, assuming `client_` would interact with a third-party service:

```ts title="src/services/my-search.ts"
class MySearchService extends AbstractSearchService {
  // ...

  async addDocuments(
    indexName: string,
    documents: Record<string, any>[],
    type: string
  ) {
    return await this.client_
      .addDocuments(indexName, documents)
  }
}
```

### replaceDocuments

This method is used to replace the existing documents in the search engine of an index with new documents.

The method accepts the following parameters:

- `indexName`: the first parameter is a string indicating the name of the index to replace the documents in.
- `documents`: the second parameter is typically an array of objects to index. For example, it can be an array of products to index. This would be the new documents to add to the index.
- `type`: the third parameter is a string indicating the type of object being indexed. For example, when indexing products, the type would be `products`.

The method should return the response of saving the documents in the search engine, but there’s no required format of the response.

An example implementation, assuming `client_` would interact with a third-party service:

```ts title="src/services/my-search.ts"
class MySearchService extends AbstractSearchService {
  // ...

  async replaceDocuments(
    indexName: string,
    documents: Record<string, any>[],
    type: string
  ) {
    await this.client_
      .removeDocuments(indexName)
    return await this.client_
      .addDocuments(indexName, documents)
  }
}
```

### deleteDocument

This method is used to delete a document from an index.

When a product is deleted in the Medusa backend, this method is used to delete the product from the search engine’s index.

The method accepts the following parameters:

- `indexName`: the first parameter is a string indicating the name of the index this document belongs in.
- `document_id`: the second parameter is a string or a number indicating the ID of the document to delete. When a product is deleted, the product’s ID is passed as the value of this parameter.

The method should return the response of deleting the document in the search engine, but there’s no required format of the response.

An example implementation, assuming `client_` would interact with a third-party service:

```ts title="src/services/my-search.ts"
class MySearchService extends AbstractSearchService {
  // ...

  async deleteDocument(
    indexName: string,
    document_id: string | number
  ) {
    return await this.client_
      .deleteDocument(indexName, document_id)
  }
}
```

### deleteAllDocuments

This method is used to delete all documents from an index.

The method accepts one parameter, which is a string indicating the name of the index to delete its documents.

The method should return the response of deleting the documents of that index in the search engine, but there’s no required format of the response.

An example implementation, assuming `client_` would interact with a third-party service:

```ts title="src/services/my-search.ts"
class MySearchService extends AbstractSearchService {
  // ...

  async deleteAllDocuments(indexName: string) {
    return await this.client_
      .deleteDocuments(indexName)
  }
}
```

### search

This method is used to search through an index by a query.

In the Medusa backend, this method is used within the [Search Products API Route](https://docs.medusajs.com/api/store#products_postproductssearch) to retrieve the search results.

This method accepts the following parameters:

1. `indexName`: the first parameter is a string indicating the index to search through. When using the Search Products API Route, the index is the default index defined in the `IndexName` static property of the `ProductService`, which is `products`.
2. `query`: the second parameter is a string indicating the query to use to search through the documents.
3. `options`: the third parameter is typically an object that can be used to pass any necessary options to the search engine.

Although there’s no required data format or type to be returned to the method, it’s recommended to return an object having a property `hits` with its value being an array of results. Each result can be an object of any format. This is recommended as this is the convention followed within Medusa’s official search plugins.

An example implementation, assuming `client_` would interact with a third-party service:

```ts title="src/services/my-search.ts"
class MySearchService extends AbstractSearchService {
  // ...

  async search(
    indexName: string,
    query: string,
    options: Record<string, any>
  ) {
    const hits = await this.client_
      .search(indexName, query)
    return {
      hits,
    }
  }
}
```

### updateSettings

This method is used to update the settings of an index within the search engine. This can be useful if you want to update the index settings when the plugin options change.

For example, in the Algolia plugin, a loader, which runs when the Medusa backend loads, is used to update the settings of indices based on the plugin options. The loader uses this method to update the settings.

The method accepts the following parameters:

1. `indexName`: the first parameter is a string indicating the index that should be updated.
2. `settings`: the second parameter is typically an object that holds the settings of the index. There’s no defined format for this parameter.

The method should return the response of updating the index in the search engine, but there’s no required format of the response.

An example implementation, assuming `client_` would interact with a third-party service:

```ts title="src/services/my-search.ts"
class MySearchService extends AbstractSearchService {
  // ...

  async updateSettings(
    indexName: string,
    settings: Record<string, any>
  ) {
    return await this.client_
      .updateSettings(indexName, settings)
  }
}
```

---

## Step 3: Run Build Command

In the directory of the Medusa backend, run the build command to transpile the files in the `src` directory into the `dist` directory:

```bash npm2yarn
npm run build
```

---

## Test it Out

:::note

This section explains how to test out your implementation if the search service was created in the Medusa backend codebase. You can refer to [the plugin documentation](../plugins/create.mdx#test-your-plugin) on how to test a plugin.

:::

Run your backend to test it out:

```bash npm2yarn
npx medusa develop
```

You can then send a request to the [Search Products API Route](https://docs.medusajs.com/api/store#products_postproductssearch) to see if your search service returns any results.

---

## See Also

- [How to create a plugin](../plugins/create.mdx)
- [How to publish a plugin](../plugins/publish.mdx)
