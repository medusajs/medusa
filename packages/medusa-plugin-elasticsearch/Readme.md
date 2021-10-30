# medusa-plugin-elasticsearch

ElasticSearch Plugin for Medusa to search for products.

## Plugin Options

```json
{
  config: {
    node: [your elasticsearch host],
  },
  settings: {
    [indexName]: [elasticsearch settings passed to elasticsearch's `putSettings()` method]
    // example
    products: {
      searchableAttributes: ["title", "description", "variant_sku", "type_value"],
      displayedAttributes: ["title", "description", "variant_sku", "type_value"],
    }
  }
}
```
