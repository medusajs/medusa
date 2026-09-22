---
"@medusajs/search-postgres": patch
---

feat(search-postgres): ignore vector fields instead of refusing the index

Vector search is only available on the lakebase engine, and a vector field in an
index definition used to make the native engine reject the whole index. That
made a definition that is valid on one provider unusable on another. The native
engine now logs which vector fields it is dropping and builds the index without
them.

Queries that explicitly ask for `search_options.vector` on the native engine are
still rejected, since answering them with keyword results would be wrong.
