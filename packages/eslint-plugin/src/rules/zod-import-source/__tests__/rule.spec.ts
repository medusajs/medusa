import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("zod-import-source", rule, {
  valid: [
    // Canonical Medusa import.
    {
      code: `import { z } from "@medusajs/framework/zod"`,
    },
    // Unrelated import.
    {
      code: `import { something } from "other"`,
    },
    // Subpath import — not the bare "zod" package.
    {
      code: `import { z } from "zod/v4"`,
    },
    // Re-export from the Medusa source.
    {
      code: `export { z } from "@medusajs/framework/zod"`,
    },
    // Side-effect import of something else.
    {
      code: `import "polyfill"`,
    },
  ],
  invalid: [
    // Named import.
    {
      code: `import { z } from "zod"`,
      output: `import { z } from "@medusajs/framework/zod"`,
      errors: [{ messageId: "zodImportSource" }],
    },
    // Default-ish namespace import.
    {
      code: `import * as z from "zod"`,
      output: `import * as z from "@medusajs/framework/zod"`,
      errors: [{ messageId: "zodImportSource" }],
    },
    // Single-quoted — quote style preserved.
    {
      code: `import { z } from 'zod'`,
      output: `import { z } from '@medusajs/framework/zod'`,
      errors: [{ messageId: "zodImportSource" }],
    },
    // Side-effect import of bare zod.
    {
      code: `import "zod"`,
      output: `import "@medusajs/framework/zod"`,
      errors: [{ messageId: "zodImportSource" }],
    },
    // Named re-export.
    {
      code: `export { z } from "zod"`,
      output: `export { z } from "@medusajs/framework/zod"`,
      errors: [{ messageId: "zodImportSource" }],
    },
    // Wildcard re-export.
    {
      code: `export * from "zod"`,
      output: `export * from "@medusajs/framework/zod"`,
      errors: [{ messageId: "zodImportSource" }],
    },
  ],
})
