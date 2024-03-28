# medusa-plugin-typesense

Typesense Plugin for Medusa to search for products.

## Plugin Options

```
{
  clientConfiguration: {
    nodes: [{
      host: 'localhost',
      port: 8108,
      protocol: 'http'
    }],
    apiKey: '<API_KEY>',
    connectionTimeoutSeconds: 2
  },
  collectionSchemas: {
    [collectionName]: [collectionSchema]
    // example
    products: {
      name: 'products',
      fields: [
        {name: 'title', type: 'string'},
        {name: 'subtitle', type: 'string', optional: true},
        {name: 'description', type: 'string', optional: true},
        {name: 'is_giftcard', type: 'bool', optional: true, facet: true},
        {name: 'status', type: 'string', optional: true, facet: true},
        {name: 'hs_code', type: 'string', optional: true},
        {name: 'origin_country', type: 'string', optional: true, facet: true},
        {name: 'material', type: 'string', optional: true, facet: true},
        {name: 'discountable', type: 'bool', optional: true, facet: true},
        {name: 'collection_id', type: 'string', optional: true},
        {name: 'type_id', type: 'string', optional: true},
        {name: 'tags_value', type: 'string[]', optional: true, facet: true},
        {name: 'variant_sku', type: 'string[]', optional: true},
        {name: 'variant_title', type: 'string[]', optional: true},
        {name: 'variant_upc', type: 'string[]', optional: true},
        {name: 'variant_ean', type: 'string[]', optional: true},
        {name: 'variant_mid_code', type: 'string[]', optional: true},
        {name: 'variant_hs_code', type: 'string[]', optional: true},
        {name: 'variant_options', type: 'string[]', optional: true},
        {name: 'variant_options_value', type: 'string[]', optional: true},
      ]
    }
  }
}
```
