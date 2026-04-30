---
"@medusajs/dashboard": major
---

Implemented quantity-based pricing within the price list edit and create forms. This includes the introduction of a new QuantityPriceForm and DataGridQuantityPriceCell component, allowing users to define tiered pricing based on minimum and maximum quantity rules. To support this, the underlying Zod schemas and utility functions for price list management were updated to handle quantity fields, and new i18n translations were added for the quantity pricing UI. Additionally, the feature is integrated into the dashboard using a StackedFocusModal for a seamless editing experience, and the Vite configuration was updated with new authentication-related environment variables as without it, local development didn't work.
