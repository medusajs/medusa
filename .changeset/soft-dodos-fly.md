---
"@medusajs/dashboard": major
"@medusajs/core-flows": major
---
Update price list quantity handling to use rules object for consistency with core-flows

WHAT the breaking change is:
The handling of min_quantity and max_quantity for price lists has been updated. These properties are now primarily managed within the rules object of a price. Specifically, in the admin dashboard, these values are no longer sent as top-level properties of the price object and are instead encapsulated within the rules object as strings.

WHY the change was made:
This change was made to ensure architectural consistency between the admin dashboard, the core workflow steps, and the underlying pricing module. The pricing module treats quantity constraints as part of the pricing rules, and aligning the rest of the system to this pattern reduces complexity and prevents data mismatch.

HOW a consumer should update their code:
If you are programmatically creating or updating prices via the API or custom workflows, you should move min_quantity and max_quantity into the rules object.

Before:

{
  "amount": 1000,
  "currency_code": "usd",
  "min_quantity": 1,
  "max_quantity": 10
}
After:

{
  "amount": 1000,
  "currency_code": "usd",
  "rules": {
    "min_quantity": "1",
    "max_quantity": "10"
  }
}
Note: The create-price-lists workflow step has been updated to support both formats during this transition period to minimize immediate breakage.
