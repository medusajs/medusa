---
"@medusajs/dashboard": patch
---

chore(dashboard): point the currency generator at src/lib/data/currencies.ts

`yarn generate:static` wrote to `src/lib/currencies.ts`, a path that no
longer exists, so running it produced an orphan file instead of refreshing
the generated `src/lib/data/currencies.ts`. The script and the prettier
target now use the live path. The script's import also pointed at a removed
module (`@medusajs/medusa/dist/utils/currencies.js`) and now reads
`defaultCurrencies` from `@medusajs/utils`. Regenerating also picks up the
core Turkish Lira native symbol (`TRY` `symbol_native` "TL" -> "₺") that
the dashboard copy had missed.
