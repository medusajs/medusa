# medusa-plugin-algolia

algolia Plugin for Medusa to search for products.

## Plugin Options

```
{
  application_id: "someId",
  admin_api_key: "someApiKey",
  settings: {
    [indexName]: [algolia settings passed to algolia's `updateSettings()` method]
    // example
    products: {
      searchableAttributes: ["title", "description", "variant_sku", "type_value"],
      attributesToRetrieve: ["title", "description", "variant_sku", "type_value"],
    }
  }
}
```
