---
"@medusajs/dashboard": patch
---

chore(dashboard): add `lib/display-names` helper for localized country and currency names

The admin dashboard renders three classes of label that stayed English in
every locale because they were not translation resources: the hard-coded
`display_name` field in `lib/data/countries.ts`, the `currency.name` field
shipped by the backend, and provider labels derived from the provider
identifier.

This change ships a small helper layer that lets call sites opt in to
locale-aware display names via the platform's `Intl.DisplayNames` API,
with a hard-coded English fallback wherever CLDR has no data (e.g. the
non-ISO `IRT` currency code, defunct codes that some locales omit). The
fallback path keeps the current English behaviour identical so a single
missing entry can never regress the screen.

The change is intentionally narrow: a new pure helper file
(`src/lib/display-names.ts`), a small `useLocaleTag` hook
(`src/hooks/use-locale-tag.ts`) that derives the BCP-47 tag from the
i18n language, a vitest spec covering the helper, and two representative
call sites (the country-flag tooltip in the order grid, and the currency
select in the campaign form) demonstrating the pattern.

Rolling the helper out to the rest of the country/currency call sites
(about ten more cells and selects), the address formatter (which needs a
different locale model - the destination country's autonym, not the
admin user's), and provider labels (which need translation keys) is
deliberately left to follow-up PRs so each can be reviewed on its own
merits.

Issue: the reporter's proposed approach (Intl.DisplayNames with an
English fallback) is implemented verbatim. The 250 x 33 translation-key
alternative the reporter flagged as the reason this had stayed English
is avoided.
