---
"medusa-plugin-meilisearch": major
"@medusajs/medusa": patch
---

feat(medusa-plugin-meilisearch): Update + improve Meilisearch plugin

**What**
- Bumps `meilisearch` dep to latest major
- Migrates plugin to TypeScript
- Changes the way indexes are configured in `medusa-config.js`:

**Before**
```
{
    resolve: `medusa-plugin-meilisearch`,
    options: {
      config: { host: "...", apiKey: "..." },
      settings: {
        products: {
          searchableAttributes: ["title"],
          displayedAttributes: ["title"],
        },
      },
    },
  },
```

**After**
```
{
    resolve: `medusa-plugin-meilisearch`,
    options: {
      config: { host: "...", apiKey: "..." },
      settings: {
        products: {
          **indexSettings**: {
            searchableAttributes: ["title"],
            displayedAttributes: ["title"],
          },
        },
      },
    },
  },
```

This is done to allow for additional configuration of indexes, that are not necessarily passed on query-time. 

We introduce two new settings:
```
settings: {
  products: {
    indexSettings: {
      searchableAttributes: ["title"],
      displayedAttributes: ["title"],,
    },
    primaryKey: "id"
    transformer: (document) => ({ id: "yo" })
  },
},
```

Meilisearch changed their primary key inference in the major release. Now we must be explicit when multiple properties end with `id`. Read more in their [docs](https://docs.meilisearch.com/learn/core_concepts/primary_key.html#primary-field).

The transformer allows developers to specify how their documents are stored in Meilisearch. It is configurable for each index.
