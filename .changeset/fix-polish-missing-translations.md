---
"@medusajs/dashboard": patch
---

fix(dashboard): add missing Polish translations

The Polish (`pl`) translation file covered 2105 of the 2438 keys in
`en.json`, so 441 keys fell through to the English fallback inside an
otherwise Polish dashboard. The gaps included very common labels such as
`actions.saveChanges`, `actions.manage`, `general.selectAll` and the whole
`layout.customize*` group, as well as entire newer domains: `roles`,
`policies`, `permissions`, `translations`, `searchIndexes`,
`propertyLabels`, `views`, `productOptions`, `priceLists.quantityPricing`
and two-factor auth in both `profile.mfa` and `login.mfa`.

- Add the 441 missing keys. Polish plural groups are expanded to all four
  categories its `plural-config.json` declares (`one`, `few`, `many`,
  `other`), so the 441 English keys become 451 Polish entries.
- Remove 15 stale `app.search.groups.*` keys (`customerGroup`,
  `productVariant`, `category`, ...). These were renamed to snake_case
  (`customer_group`, `product_variant`, `product_category`, ...), so the
  camelCase names were dead code i18next could never reach and the
  translation schema rejects them.

No pre-existing Polish value is modified or dropped. `yarn i18n:validate
pl.json` failed before this change and now passes.
