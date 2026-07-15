import { rule } from "../rule"
import {
  cleanupFixtureWorkspaces,
  createFixtureWorkspace,
  createRuleTester,
  type FixtureFile,
} from "../../../test-utils"

afterAll(cleanupFixtureWorkspaces)

// Place files under <tmp>/src/modules/hello/
const makeModule = (files: FixtureFile[]) =>
  createFixtureWorkspace("src/modules/hello", files)

const LOADER_CODE = `
import { LoaderOptions } from "@medusajs/framework/types"
export default async function helloWorldLoader({ container }: LoaderOptions) {
  return
}
`

const INDEX_REGISTERED = `
import { Module } from "@medusajs/framework/utils"
import HelloService from "./service"
import helloWorldLoader from "./loaders/hello-world"

export default Module("hello", {
  service: HelloService,
  loaders: [helloWorldLoader],
})
`

const INDEX_REGISTERED_NAMED = `
import { Module } from "@medusajs/framework/utils"
import HelloService from "./service"
import { loader as helloWorldLoader } from "./loaders/hello-world"

export default Module("hello", {
  service: HelloService,
  loaders: [helloWorldLoader],
})
`

const INDEX_NO_LOADERS = `
import { Module } from "@medusajs/framework/utils"
import HelloService from "./service"

export default Module("hello", {
  service: HelloService,
})
`

const INDEX_IMPORTED_NOT_IN_ARRAY = `
import { Module } from "@medusajs/framework/utils"
import HelloService from "./service"
import helloWorldLoader from "./loaders/hello-world"

void helloWorldLoader

export default Module("hello", {
  service: HelloService,
  loaders: [],
})
`

const INDEX_ALIASED_MODULE = `
import { Module as M } from "@medusajs/framework/utils"
import HelloService from "./service"
import helloWorldLoader from "./loaders/hello-world"

export default M("hello", {
  service: HelloService,
  loaders: [helloWorldLoader],
})
`

const INDEX_ONLY_OTHER_LOADER = `
import { Module } from "@medusajs/framework/utils"
import HelloService from "./service"
import otherLoader from "./loaders/other"

export default Module("hello", {
  service: HelloService,
  loaders: [otherLoader],
})
`

const ruleTester = createRuleTester()

// Build fixtures and reuse them across cases.
const validRegistered = makeModule([
  { rel: "index.ts", content: INDEX_REGISTERED },
  { rel: "loaders/hello-world.ts", content: LOADER_CODE },
])

const validRegisteredNamed = makeModule([
  { rel: "index.ts", content: INDEX_REGISTERED_NAMED },
  { rel: "loaders/hello-world.ts", content: LOADER_CODE },
])

const validAliasedModule = makeModule([
  { rel: "index.ts", content: INDEX_ALIASED_MODULE },
  { rel: "loaders/hello-world.ts", content: LOADER_CODE },
])

const validNoIndex = makeModule([
  { rel: "loaders/hello-world.ts", content: LOADER_CODE },
])

const invalidNoLoadersKey = makeModule([
  { rel: "index.ts", content: INDEX_NO_LOADERS },
  { rel: "loaders/hello-world.ts", content: LOADER_CODE },
])

const invalidImportedNotInArray = makeModule([
  { rel: "index.ts", content: INDEX_IMPORTED_NOT_IN_ARRAY },
  { rel: "loaders/hello-world.ts", content: LOADER_CODE },
])

const invalidOnlyOtherLoader = makeModule([
  { rel: "index.ts", content: INDEX_ONLY_OTHER_LOADER },
  { rel: "loaders/hello-world.ts", content: LOADER_CODE },
  { rel: "loaders/other.ts", content: LOADER_CODE },
])

ruleTester.run("loader-must-be-exported-in-module-definition", rule, {
  valid: [
    // Loader is default-imported and present in loaders array.
    {
      code: LOADER_CODE,
      filename: validRegistered.resolve("loaders/hello-world.ts"),
    },
    // Loader is named-imported (aliased) and present in loaders array.
    {
      code: LOADER_CODE,
      filename: validRegisteredNamed.resolve("loaders/hello-world.ts"),
    },
    // Module is imported under an alias; loader is still registered.
    {
      code: LOADER_CODE,
      filename: validAliasedModule.resolve("loaders/hello-world.ts"),
    },
    // No index.ts at all — rule is a no-op (can't verify).
    {
      code: LOADER_CODE,
      filename: validNoIndex.resolve("loaders/hello-world.ts"),
    },
    // File outside a module loaders directory — rule is a no-op.
    {
      code: LOADER_CODE,
      filename: "/some/other/path/file.ts",
    },
    // The sibling loader IS registered (invalidOnlyOtherLoader fixture).
    {
      code: LOADER_CODE,
      filename: invalidOnlyOtherLoader.resolve("loaders/other.ts"),
    },
  ],
  invalid: [
    // index.ts has no `loaders` property at all.
    {
      code: LOADER_CODE,
      filename: invalidNoLoadersKey.resolve("loaders/hello-world.ts"),
      errors: [{ messageId: "loaderNotRegistered" }],
    },
    // index.ts imports the loader but doesn't include it in the loaders array.
    {
      code: LOADER_CODE,
      filename: invalidImportedNotInArray.resolve("loaders/hello-world.ts"),
      errors: [{ messageId: "loaderNotRegistered" }],
    },
    // index.ts registers a different loader but not this one.
    {
      code: LOADER_CODE,
      filename: invalidOnlyOtherLoader.resolve("loaders/hello-world.ts"),
      errors: [{ messageId: "loaderNotRegistered" }],
    },
  ],
})
