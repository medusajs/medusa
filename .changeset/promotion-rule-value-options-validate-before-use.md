---
"@medusajs/medusa": patch
---

fix(medusa): return 400 instead of 500 for an invalid promotion rule attribute with a value filter

`GET /admin/promotions/rule-value-options/:rule_type/:rule_attribute_id` dereferenced the rule's query configuration before validating the attribute, so an invalid `rule_attribute_id` combined with a `value` query param threw a `TypeError` (500) instead of the proper "Invalid rule attribute" 400. The attribute is now validated before its query configuration is used.
