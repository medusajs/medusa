# medusa-plugin-algolia

Algolia Plugin for Medusa to search for products.

Learn more about how you can use this plugin in the [documentaion](https://docs.medusajs.com/add-plugins/algolia).

## Options

```js
{
  applicationId: "someId",
  adminApiKey: "someApiKey",
  settings: {
    [indexName]: [algolia settings passed to algolia's `updateSettings()` method]
    // example
    products: {
      indexSettings: {
        searchableAttributes: ["title", "description", "variant_sku", "type_value"],
        attributesToRetrieve: ["title", "description", "variant_sku", "type_value"],
      }
      transformer: (product: Product) => ({ id: product.id })
    }
  }
}
```
