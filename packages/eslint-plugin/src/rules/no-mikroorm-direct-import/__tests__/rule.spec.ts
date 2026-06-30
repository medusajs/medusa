import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("no-mikroorm-direct-import", rule, {
  valid: [
    // Canonical framework re-exports.
    {
      code: `import { Migration } from "@medusajs/framework/mikro-orm/migrations"`,
    },
    {
      code: `import { EntityManager } from "@medusajs/framework/mikro-orm/core"`,
    },
    { code: `import { asValue } from "@medusajs/framework/awilix"` },
    // Unrelated third-party imports.
    { code: `import { z } from "zod"` },
    { code: `import express from "express"` },
    // A package whose name merely contains "awilix" but isn't bare awilix.
    { code: `import x from "awilix-manager"` },
    // Not the @mikro-orm scope.
    { code: `import x from "@mikro-orm-extras/core"` },
  ],
  invalid: [
    // Known @mikro-orm subpaths → framework re-export (autofix).
    {
      code: `import { Migration } from "@mikro-orm/migrations"`,
      output: `import { Migration } from "@medusajs/framework/mikro-orm/migrations"`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    {
      code: `import { EntityManager } from "@mikro-orm/core"`,
      output: `import { EntityManager } from "@medusajs/framework/mikro-orm/core"`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    {
      code: `import { Knex } from "@mikro-orm/knex"`,
      output: `import { Knex } from "@medusajs/framework/mikro-orm/knex"`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    {
      code: `import { PostgreSqlDriver } from "@mikro-orm/postgresql"`,
      output: `import { PostgreSqlDriver } from "@medusajs/framework/mikro-orm/postgresql"`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    {
      code: `import { MikroORM } from "@mikro-orm/cli"`,
      output: `import { MikroORM } from "@medusajs/framework/mikro-orm/cli"`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    // awilix → framework re-export (autofix).
    {
      code: `import { asValue } from "awilix"`,
      output: `import { asValue } from "@medusajs/framework/awilix"`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    // Quote style preserved on autofix.
    {
      code: `import { asValue } from 'awilix'`,
      output: `import { asValue } from '@medusajs/framework/awilix'`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    // Re-export of a known subpath (autofix).
    {
      code: `export { Migration } from "@mikro-orm/migrations"`,
      output: `export { Migration } from "@medusajs/framework/mikro-orm/migrations"`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    {
      code: `export * from "awilix"`,
      output: `export * from "@medusajs/framework/awilix"`,
      errors: [{ messageId: "useFrameworkReexport" }],
    },
    // A @mikro-orm subpath with no framework re-export → flag, no autofix.
    {
      code: `import { Seeder } from "@mikro-orm/seeder"`,
      errors: [{ messageId: "noDirectMikroOrmImport" }],
    },
    // Deep import into a re-exported package → flag, no autofix (only the
    // exact subpath is re-exported, not deep paths).
    {
      code: `import { foo } from "@mikro-orm/core/decorators"`,
      errors: [{ messageId: "noDirectMikroOrmImport" }],
    },
  ],
})
