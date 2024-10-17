---
"@medusajs/medusa": patch
---

### Summary
Update the workflow endpoint documentation to include the missing `name` query parameter.

### Details
This change addresses an issue in the documentation where the example request to the workflow endpoint did not include the required `name` query parameter. As a result, using the workflow without this parameter led to undefined behavior in the application.

### Code Example
The following example has been added to the documentation:

```bash
curl http://localhost:9000/workflow?name=john

```

### References
This change is related to issue #[9628](https://github.com/medusajs/medusa/issues/9628) where it was reported that the absence of the query parameter caused issues in the code.