---
"@medusajs/utils": minor
---

add a custom name to MedusaError

# Why?

You can now identify the error type using the `error.constructor.name` or `error instanceof` method.

# How to update your code?

Initially, probably no change is required.
In the future you might find yourself in a situation, where handling a `MedusaError` is different from other errors.

