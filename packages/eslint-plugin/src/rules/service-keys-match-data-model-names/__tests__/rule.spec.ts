import { rule } from "../rule"
import {
  cleanupFixtureWorkspaces,
  createFixtureWorkspace,
  createRuleTester,
  type FixtureFile,
} from "../../../test-utils"

afterAll(cleanupFixtureWorkspaces)

const ruleTester = createRuleTester()

// -----------------------------------------------------------------------
// Same-file cases — no disk access needed.
// -----------------------------------------------------------------------
ruleTester.run("service-keys-match-data-model-names", rule, {
  valid: [
    // Shorthand key already matches the model's PascalCase name.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const Brand = model.define("brand", { id: model.id().primaryKey() })
        class BrandModuleService extends MedusaService({ Brand }) {}
      `,
    },
    // Explicit (non-shorthand) key already matches.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const Brand = model.define("brand", {})
        class BrandModuleService extends MedusaService({ Brand: Brand }) {}
      `,
    },
    // Inline model.define value directly in the object, key matches.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        class BrandModuleService extends MedusaService({
          Brand: model.define("brand", {}),
        }) {}
      `,
    },
    // Multi-word snake_case name, key matches.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const ProductMedia = model.define("product_media", {})
        class S extends MedusaService({ ProductMedia }) {}
      `,
    },
    // Non-relative import source (bare alias) — can't resolve, so no report.
    {
      code: `
        import { MedusaService } from "@medusajs/framework/utils"
        import { WooImportRun } from "@models"
        class MyService extends MedusaService({ ImportRun: WooImportRun }) {}
      `,
    },
    // MedusaService not imported from the framework — not tracked.
    {
      code: `
        import { MedusaService } from "some-other-lib"
        class MyService extends MedusaService({ ImportRun: WooImportRun }) {}
      `,
    },
    // Not a MedusaService(...) call at all.
    {
      code: `
        function OtherFactory(models) { return models }
        class MyService extends OtherFactory({ ImportRun: WooImportRun }) {}
      `,
    },
    // `models` passed through a local const rather than inline.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const Brand = model.define("brand", {})
        const models = { Brand }
        class S extends MedusaService(models) {}
      `,
    },
  ],
  invalid: [
    // Same-file mismatch, explicit key — fixable.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const WooImportRun = model.define("woo_import_run", {})
        class MyService extends MedusaService({ ImportRun: WooImportRun }) {}
      `,
      errors: [{ messageId: "serviceKeyMismatch" }],
      output: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const WooImportRun = model.define("woo_import_run", {})
        class MyService extends MedusaService({ WooImportRun: WooImportRun }) {}
      `,
    },
    // Same-file mismatch, shorthand key — fix expands to `Expected: identifier`.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const Foo = model.define("woo_import_run", {})
        class MyService extends MedusaService({ Foo }) {}
      `,
      errors: [{ messageId: "serviceKeyMismatch" }],
      output: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const Foo = model.define("woo_import_run", {})
        class MyService extends MedusaService({ WooImportRun: Foo }) {}
      `,
    },
    // Inline model.define value, key mismatched.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        class MyService extends MedusaService({
          ImportRun: model.define("woo_import_run", {}),
        }) {}
      `,
      errors: [{ messageId: "serviceKeyMismatch" }],
      output: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        class MyService extends MedusaService({
          WooImportRun: model.define("woo_import_run", {}),
        }) {}
      `,
    },
    // Only the mismatched key is reported among several.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const Brand = model.define("brand", {})
        const WooImportRun = model.define("woo_import_run", {})
        class S extends MedusaService({ Brand, ImportRun: WooImportRun }) {}
      `,
      errors: [{ messageId: "serviceKeyMismatch" }],
      output: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const Brand = model.define("brand", {})
        const WooImportRun = model.define("woo_import_run", {})
        class S extends MedusaService({ Brand, WooImportRun: WooImportRun }) {}
      `,
    },
    // Renaming the key would collide with an existing sibling key — reported,
    // but no autofix offered.
    {
      code: `
        import { model, MedusaService } from "@medusajs/framework/utils"
        const WooImportRun = model.define("woo_import_run", {})
        class S extends MedusaService({
          WooImportRun: 1,
          ImportRun: WooImportRun,
        }) {}
      `,
      errors: [{ messageId: "serviceKeyMismatch" }],
    },
  ],
})

// -----------------------------------------------------------------------
// Cross-file cases — the reported bug: the model lives in a sibling file.
// -----------------------------------------------------------------------
const makeModule = (files: FixtureFile[]) =>
  createFixtureWorkspace("src/modules/woo", files)

const MODEL_NAMED_EXPORT = `
import { model } from "@medusajs/framework/utils"
export const Brand = model.define("brand", { id: model.id().primaryKey() })
`

const MODEL_DEFAULT_EXPORT = `
import { model } from "@medusajs/framework/utils"
const WooImportRun = model.define("woo_import_run", { id: model.id().primaryKey() })
export default WooImportRun
`

const SERVICE_NAMED_MATCH = `
import { MedusaService } from "@medusajs/framework/utils"
import { Brand } from "./models/brand"
class BrandModuleService extends MedusaService({ Brand }) {}
`

const SERVICE_DEFAULT_MATCH = `
import { MedusaService } from "@medusajs/framework/utils"
import WooImportRun from "./models/import-run"
class MyService extends MedusaService({ WooImportRun }) {}
`

const SERVICE_DEFAULT_MISMATCH = `
import { MedusaService } from "@medusajs/framework/utils"
import WooImportRun from "./models/import-run"
class MyService extends MedusaService({ ImportRun: WooImportRun }) {}
`

const SERVICE_ALIASED_IMPORT_MATCH = `
import { MedusaService } from "@medusajs/framework/utils"
import { Brand as B } from "./models/brand"
class BrandModuleService extends MedusaService({ Brand: B }) {}
`

const validNamedMatch = makeModule([
  { rel: "service.ts", content: SERVICE_NAMED_MATCH },
  { rel: "models/brand.ts", content: MODEL_NAMED_EXPORT },
])

const validDefaultMatch = makeModule([
  { rel: "service.ts", content: SERVICE_DEFAULT_MATCH },
  { rel: "models/import-run.ts", content: MODEL_DEFAULT_EXPORT },
])

const validAliasedImport = makeModule([
  { rel: "service.ts", content: SERVICE_ALIASED_IMPORT_MATCH },
  { rel: "models/brand.ts", content: MODEL_NAMED_EXPORT },
])

const invalidDefaultMismatch = makeModule([
  { rel: "service.ts", content: SERVICE_DEFAULT_MISMATCH },
  { rel: "models/import-run.ts", content: MODEL_DEFAULT_EXPORT },
])

ruleTester.run("service-keys-match-data-model-names (cross-file)", rule, {
  valid: [
    // Named export, key matches the model's own name.
    {
      code: SERVICE_NAMED_MATCH,
      filename: validNamedMatch.resolve("service.ts"),
    },
    // Default export, shorthand key matches.
    {
      code: SERVICE_DEFAULT_MATCH,
      filename: validDefaultMatch.resolve("service.ts"),
    },
    // Aliased import binding — resolution follows the *imported* name, not
    // the local alias.
    {
      code: SERVICE_ALIASED_IMPORT_MATCH,
      filename: validAliasedImport.resolve("service.ts"),
    },
  ],
  invalid: [
    // The reported bug, verbatim: default-exported model, mismatched key.
    {
      code: SERVICE_DEFAULT_MISMATCH,
      filename: invalidDefaultMismatch.resolve("service.ts"),
      errors: [{ messageId: "serviceKeyMismatch" }],
      output: `
import { MedusaService } from "@medusajs/framework/utils"
import WooImportRun from "./models/import-run"
class MyService extends MedusaService({ WooImportRun: WooImportRun }) {}
`,
    },
  ],
})
