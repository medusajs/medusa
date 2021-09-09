# medusa-plugin-meilisearch

Meilisearch Plugin for Medusa to search for products.

## Plugin Options
```
{
  config: {
    host: [your meilisearch host],
  },
  settings: [meilisearch settings passed to meilisearch's `updateSettings()` method on an index:
  //example
  {
    searchableAttributes: ["title", "description", "sku"],
    displayedAttributes: ["title", "description", "sku"],
  }
  ],
}
```