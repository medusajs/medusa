---
"@medusajs/dashboard": patch
---

feat(dashboard): add Iran's provinces to the country-states data

Iran (`IR`) had no sub-national entries in `country-states.ts`, so the
province select was disabled for Iranian addresses and province-level tax
regions could not be created from the dashboard. The 31 ISO 3166-2:IR
provinces (`IR-00` Markazi through `IR-30` Alborz) are now included.
