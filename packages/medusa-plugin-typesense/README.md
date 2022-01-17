# medusa-plugin-typesense

Typesense Plugin for Medusa to search for products.

## Plugin Options

```
{
  config: {},
  settings: {
    [indexName]: 
    // example
    products: {
      searchableAttributes: ["title", "description", "variant_sku", "type_value"],
      displayedAttributes: ["title", "description", "variant_sku", "type_value"],
    }
  }
}
```
