---
"@medusajs/draft-order": patch
"@medusajs/dashboard": patch
---

fix(draft-order,dashboard): translate the draft order admin screens

The draft order plugin's admin screens rendered hard-coded English regardless of the selected admin language. The components are copies of dashboard components with the `t()` calls stripped out, so the strings were duplicated as literals even where the matching key already shipped in every locale. This wires them back up to `useTranslation`, passes `translations` to the plugin's `DataTable` so its search and pagination controls follow the locale, and adds the keys that had no equivalent under the existing `draftOrders` namespace.
