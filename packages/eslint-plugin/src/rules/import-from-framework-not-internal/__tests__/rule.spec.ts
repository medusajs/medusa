import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("import-from-framework-not-internal", rule, {
  valid: [
    // Canonical framework entry points.
    { code: `import { MedusaError } from "@medusajs/framework/utils"` },
    { code: `import type { Context } from "@medusajs/framework/types"` },
    {
      code: `import { createWorkflow } from "@medusajs/framework/workflows-sdk"`,
    },
    { code: `import { defineMiddlewares } from "@medusajs/framework/http"` },
    // Other public packages are fine.
    { code: `import { deleteOrderWorkflow } from "@medusajs/core-flows"` },
    { code: `import { defineWidgetConfig } from "@medusajs/admin-sdk"` },
    // Unrelated third-party import.
    { code: `import { z } from "zod"` },
    // A @medusajs package whose name merely contains "dist" — not a dist deep import.
    { code: `import x from "@medusajs/some-dist-thing"` },
    // Public subpath that isn't dist.
    { code: `import { Modules } from "@medusajs/framework/utils"` },
  ],
  invalid: [
    // Deprecated standalone package → framework subpath (autofix).
    {
      code: `import { MedusaError } from "@medusajs/utils"`,
      output: `import { MedusaError } from "@medusajs/framework/utils"`,
      errors: [{ messageId: "useFrameworkEntrypoint" }],
    },
    {
      code: `import type { Context } from "@medusajs/types"`,
      output: `import type { Context } from "@medusajs/framework/types"`,
      errors: [{ messageId: "useFrameworkEntrypoint" }],
    },
    {
      code: `import { createWorkflow } from "@medusajs/workflows-sdk"`,
      output: `import { createWorkflow } from "@medusajs/framework/workflows-sdk"`,
      errors: [{ messageId: "useFrameworkEntrypoint" }],
    },
    {
      code: `import { MedusaModule } from "@medusajs/modules-sdk"`,
      output: `import { MedusaModule } from "@medusajs/framework/modules-sdk"`,
      errors: [{ messageId: "useFrameworkEntrypoint" }],
    },
    {
      code: `import { TransactionOrchestrator } from "@medusajs/orchestration"`,
      output: `import { TransactionOrchestrator } from "@medusajs/framework/orchestration"`,
      errors: [{ messageId: "useFrameworkEntrypoint" }],
    },
    // Quote style preserved on autofix.
    {
      code: `import { MedusaError } from '@medusajs/utils'`,
      output: `import { MedusaError } from '@medusajs/framework/utils'`,
      errors: [{ messageId: "useFrameworkEntrypoint" }],
    },
    // Re-export of a deprecated package.
    {
      code: `export { MedusaError } from "@medusajs/utils"`,
      output: `export { MedusaError } from "@medusajs/framework/utils"`,
      errors: [{ messageId: "useFrameworkEntrypoint" }],
    },
    {
      code: `export * from "@medusajs/types"`,
      output: `export * from "@medusajs/framework/types"`,
      errors: [{ messageId: "useFrameworkEntrypoint" }],
    },
    // Deep dist import of the main package → no autofix.
    {
      code: `import { foo } from "@medusajs/medusa/dist/utils/foo"`,
      errors: [{ messageId: "noInternalImport" }],
    },
    // Deep dist import of the framework package → no autofix.
    {
      code: `import { bar } from "@medusajs/framework/dist/utils"`,
      errors: [{ messageId: "noInternalImport" }],
    },
    // dist as the trailing segment.
    {
      code: `import x from "@medusajs/medusa/dist"`,
      errors: [{ messageId: "noInternalImport" }],
    },
    // Nested dist segment.
    {
      code: `import x from "@medusajs/product/dist/services/product"`,
      errors: [{ messageId: "noInternalImport" }],
    },
    // Re-export from internal build output.
    {
      code: `export { x } from "@medusajs/medusa/dist/x"`,
      errors: [{ messageId: "noInternalImport" }],
    },
  ],
})
