import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("use-query-context-utility", rule, {
  valid: [
    // Canonical: context wrapped with QueryContext.
    {
      code: `
        import { QueryContext } from "@medusajs/framework/utils"
        query.graph({
          entity: "product",
          fields: ["*"],
          context: QueryContext({ region_id: "us" }),
        })
      `,
    },
    // No context property.
    {
      code: `query.graph({ entity: "product", fields: ["*"] })`,
    },
    // context on second-arg options object — wrapped.
    {
      code: `
        import { QueryContext } from "@medusajs/framework/utils"
        query.index(
          { entity: "product", fields: ["*"] },
          { context: QueryContext({ region_id: "us" }) }
        )
      `,
    },
    // context value is an identifier (not an object literal) — out of scope.
    {
      code: `query.graph({ entity: "product", context: ctx })`,
    },
    // Unrelated method on query receiver.
    {
      code: `query.list({ context: { region_id: "us" } })`,
    },
    // Unrelated receiver.
    {
      code: `other.graph({ context: { region_id: "us" } })`,
    },
    // Aliased QueryContext — still recognized.
    {
      code: `
        import { QueryContext as QC } from "@medusajs/framework/utils"
        query.graph({ context: QC({ region_id: "us" }) })
      `,
    },
    // MemberExpression receiver ending in .query.
    {
      code: `
        import { QueryContext } from "@medusajs/framework/utils"
        req.scope.query.graph({ context: QueryContext({ region_id: "us" }) })
      `,
    },
  ],
  invalid: [
    // Bare object context on first arg — no existing import.
    {
      code: `query.graph({ entity: "product", context: { region_id: "us" } })`,
      errors: [{ messageId: "useQueryContext" }],
      output: `import { QueryContext } from "@medusajs/framework/utils"\nquery.graph({ entity: "product", context: QueryContext({ region_id: "us" }) })`,
    },
    // query.index with bare context object.
    {
      code: `query.index({ entity: "product", context: { region_id: "us" } })`,
      errors: [{ messageId: "useQueryContext" }],
      output: `import { QueryContext } from "@medusajs/framework/utils"\nquery.index({ entity: "product", context: QueryContext({ region_id: "us" }) })`,
    },
    // context on second-arg options object.
    {
      code: `query.graph({ entity: "product" }, { context: { region_id: "us" } })`,
      errors: [{ messageId: "useQueryContext" }],
      output: `import { QueryContext } from "@medusajs/framework/utils"\nquery.graph({ entity: "product" }, { context: QueryContext({ region_id: "us" }) })`,
    },
    // Existing framework/utils import — append to specifier list.
    {
      code: `
import { Modules } from "@medusajs/framework/utils"
query.graph({ context: { region_id: "us" } })
      `,
      errors: [{ messageId: "useQueryContext" }],
      output: `
import { Modules, QueryContext } from "@medusajs/framework/utils"
query.graph({ context: QueryContext({ region_id: "us" }) })
      `,
    },
    // QueryContext already imported — reuse binding.
    {
      code: `
import { QueryContext } from "@medusajs/framework/utils"
query.graph({ context: { region_id: "us" } })
      `,
      errors: [{ messageId: "useQueryContext" }],
      output: `
import { QueryContext } from "@medusajs/framework/utils"
query.graph({ context: QueryContext({ region_id: "us" }) })
      `,
    },
    // Aliased QueryContext import — use alias.
    {
      code: `
import { QueryContext as QC } from "@medusajs/framework/utils"
query.graph({ context: { region_id: "us" } })
      `,
      errors: [{ messageId: "useQueryContext" }],
      output: `
import { QueryContext as QC } from "@medusajs/framework/utils"
query.graph({ context: QC({ region_id: "us" }) })
      `,
    },
    // Both args have bare context — two errors.
    {
      code: `query.graph({ context: { a: 1 } }, { context: { b: 2 } })`,
      errors: [
        { messageId: "useQueryContext" },
        { messageId: "useQueryContext" },
      ],
      output: `import { QueryContext } from "@medusajs/framework/utils"\nquery.graph({ context: QueryContext({ a: 1 }) }, { context: QueryContext({ b: 2 }) })`,
    },
    // MemberExpression receiver ending in .query.
    {
      code: `req.scope.query.graph({ context: { region_id: "us" } })`,
      errors: [{ messageId: "useQueryContext" }],
      output: `import { QueryContext } from "@medusajs/framework/utils"\nreq.scope.query.graph({ context: QueryContext({ region_id: "us" }) })`,
    },
    // String-literal "context" key.
    {
      code: `query.graph({ "context": { region_id: "us" } })`,
      errors: [{ messageId: "useQueryContext" }],
      output: `import { QueryContext } from "@medusajs/framework/utils"\nquery.graph({ "context": QueryContext({ region_id: "us" }) })`,
    },
  ],
})
