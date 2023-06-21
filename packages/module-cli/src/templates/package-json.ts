import { writeFile } from "fs/promises"
import log from "../utils/logger.js"
import { spinner } from "../index.js"
import { resolve } from "path"

export async function generatePackageJson({
  moduleName,
  modulePath,
}: {
  moduleName: string
  modulePath: string
}) {
  log(`Generating package.json`)

  const template: any = {
    name: `medusa-module-${moduleName}`,
    version: "0.0.1",
    description: `Medusa ${moduleName} module`,
    main: "dist/index.js",
    types: "dist/index.d.ts",
    files: ["dist"],
    bin: {
      [`medusa-${moduleName}-migrations-down`]:
        "dist/scripts/bin/run-migration-down.js",
      [`medusa-${moduleName}-migrations-up`]:
        "dist/scripts/bin/run-migration-up.js",
      [`medusa-${moduleName}-seed`]: "dist/scripts/bin/run-seed.js",
    },
    repository: {},
    publishConfig: {
      access: "public",
    },
    author: "",
    license: "MIT",
    scripts: {
      watch: "tsc --build --watch",
      "watch:test": "tsc --build tsconfig.spec.json --watch",
      prepare: "cross-env NODE_ENV=production yarn run build",
      build: "rimraf dist && tsc --build && tsc-alias -p tsconfig.json",
      test: "jest --runInBand --forceExit -- src/**/__tests__/**/*.ts",
      "test:integration":
        "jest --runInBand --forceExit -- integration-tests/**/__tests__/**/*.ts",
      "migration:generate":
        " MIKRO_ORM_CLI=./mikro-orm.config.dev.ts mikro-orm migration:generate",
      "migration:initial":
        " MIKRO_ORM_CLI=./mikro-orm.config.dev.ts mikro-orm migration:create --initial",
      "migration:create":
        " MIKRO_ORM_CLI=./mikro-orm.config.dev.ts mikro-orm migration:create",
      "migration:up":
        " MIKRO_ORM_CLI=./mikro-orm.config.dev.ts mikro-orm migration:up",
      "orm:cache:clear":
        " MIKRO_ORM_CLI=./mikro-orm.config.dev.ts mikro-orm cache:clear",
    },
    devDependencies: {
      "@mikro-orm/cli": "5.7.12",
      "@mikro-orm/migrations": "5.7.12",
      "cross-env": "^5.2.1",
      jest: "^25.5.4",
      "medusa-test-utils": "^1.1.40",
      "pg-god": "^1.0.12",
      rimraf: "^3.0.2",
      "ts-jest": "^25.5.1",
      "ts-node": "^10.9.1",
      "tsc-alias": "^1.8.6",
      typescript: "^4.4.4",
    },
    dependencies: {
      "@medusajs/modules-sdk": "latest",
      "@medusajs/types": "latest",
      "@medusajs/utils": "latest",
      "@mikro-orm/core": "5.7.12",
      "@mikro-orm/migrations": "5.7.12",
      "@mikro-orm/postgresql": "5.7.12",
      awilix: "^8.0.0",
      dotenv: "^16.1.4",
      lodash: "^4.17.21",
    },
  }

  try {
    const path = resolve(modulePath, "package.json")
    await writeFile(path, JSON.stringify(template, null, 4))
    spinner.succeed(`package.json generated`)
  } catch (error) {
    log(`Failed to generate package.json`, "error")
    throw error
  }
}
