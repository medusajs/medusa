# medusa-plugin-meilisearch

Meilisearch Plugin for Medusa to search for products.

## Plugin Options
```
{
  config: {
    host: [your meilisearch host],
  },
  settings: {
    [indexName]: [meilisearch settings passed to meilisearch's `updateSettings()` method]
    // example
    products: {
      searchableAttributes: ["title", "description", "variant_sku", "type_value"],
      displayedAttributes: ["title", "description", "variant_sku", "type_value"],
    }
  }
}
```