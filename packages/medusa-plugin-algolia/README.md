# medusa-plugin-algolia

algolia Plugin for Medusa to search for products.

## Plugin Options
```
{
  config: {
    host: [your algolia host],
  },
  settings: {
    [indexName]: [algolia settings passed to algolia's `updateSettings()` method]
    // example
    products: {
      searchableAttributes: ["title", "description", "variant_sku", "type_value"],
      displayedAttributes: ["title", "description", "variant_sku", "type_value"],
    }
  }
}
```