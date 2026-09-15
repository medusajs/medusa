---
"@medusajs/dashboard": patch
---

chore(dashboard): add per-locale plural-form coverage test

The existing `validate-translations.spec.ts` only checked that `en.json`
has the plural forms `pluralConfig.en` requires, and the
`yarn i18n:validate` script only checks the file(s) the diff added. The
silent-regression window this leaves is real: a translation file can
ship a partial set of plural forms and no test or CI step notices until
a maintainer eyeballs it.

This change adds a per-locale plural-form coverage test. Every locale in
`pluralConfig` (other than `en`, which the pre-existing test covers) gets
its own `it` test that walks the file's plural groups and checks each
one has every required form and no extra forms. Locales listed in
`READY_LOCALES` are enforced strictly: the test fails on a missing form.
All other locales are reported-only: the test prints the missing forms
via `console.warn` but does not fail, so the test is informational
across the board without blocking unrelated PRs. As follow-up PRs bring
more locales up to spec, they can be promoted to strict mode by adding
them to `READY_LOCALES`.

The pre-existing three tests in the file are unchanged.
