import { rule } from "../rule"
import {
  cleanupFixtureWorkspaces,
  createFixtureWorkspace,
  createRuleTester,
  type FixtureFile,
} from "../../../test-utils"

afterAll(cleanupFixtureWorkspaces)

/**
 * Writes a set of job files under `<tmp>/src/jobs/` and returns the workspace.
 * The current file under test must also be written so the cross-file scan sees
 * the same content the rule lints.
 */
const makeJobs = (files: FixtureFile[]) =>
  createFixtureWorkspace("src/jobs", files)

const jobCode = (name: string): string =>
  `export default async function () {}
export const config = { name: "${name}", schedule: "0 0 * * *" }`

const ruleTester = createRuleTester()

// --- Valid fixtures -------------------------------------------------------

// Two jobs with distinct names.
const uniqueNames = makeJobs([
  { rel: "sync-products.ts", content: jobCode("sync-products") },
  { rel: "send-newsletter.ts", content: jobCode("send-newsletter") },
])

// Only one job file in the project — nothing to collide with.
const singleJob = makeJobs([
  { rel: "sync-products.ts", content: jobCode("sync-products") },
])

// Same name appears once here and once in a nested non-jobs sibling that the
// scan still walks — but the names differ, so it's valid. (Sanity: nested dirs
// are walked.)
const nestedDistinct = makeJobs([
  { rel: "sync-products.ts", content: jobCode("sync-products") },
  { rel: "nested/cleanup.ts", content: jobCode("cleanup") },
])

// A sibling file has no resolvable name (config built by a call) — can't
// collide, so the current file is valid.
const siblingUnresolvable = makeJobs([
  { rel: "sync-products.ts", content: jobCode("sync-products") },
  {
    rel: "other.ts",
    content: `export const config = buildConfig()`,
  },
])

// Current file's name isn't a string literal — rule can't compare, so valid.
const nonLiteralName = makeJobs([
  {
    rel: "dynamic.ts",
    content: `const JOB_NAME = "sync-products"
export const config = { name: JOB_NAME, schedule: "0 0 * * *" }`,
  },
  { rel: "sync-products.ts", content: jobCode("sync-products") },
])

// --- Invalid fixtures -----------------------------------------------------

// Two job files declare the same name.
const duplicateNames = makeJobs([
  { rel: "sync-products.ts", content: jobCode("sync-products") },
  { rel: "sync-products-copy.ts", content: jobCode("sync-products") },
])

// Duplicate where the colliding file lives in a nested directory.
const duplicateNested = makeJobs([
  { rel: "sync-products.ts", content: jobCode("sync-products") },
  { rel: "archive/old-sync.ts", content: jobCode("sync-products") },
])

// Duplicate where the config is declared then exported by specifier.
const duplicateViaSpecifier = makeJobs([
  { rel: "sync-products.ts", content: jobCode("sync-products") },
  {
    rel: "alias.ts",
    content: `const config = { name: "sync-products", schedule: "* * * * *" }
export { config }`,
  },
])

ruleTester.run("scheduled-job-name-unique", rule, {
  valid: [
    {
      code: jobCode("sync-products"),
      filename: uniqueNames.resolve("sync-products.ts"),
    },
    {
      code: jobCode("sync-products"),
      filename: singleJob.resolve("sync-products.ts"),
    },
    {
      code: jobCode("sync-products"),
      filename: nestedDistinct.resolve("sync-products.ts"),
    },
    {
      code: jobCode("sync-products"),
      filename: siblingUnresolvable.resolve("sync-products.ts"),
    },
    {
      code: `const JOB_NAME = "sync-products"
export const config = { name: JOB_NAME, schedule: "0 0 * * *" }`,
      filename: nonLiteralName.resolve("dynamic.ts"),
    },
    // File outside any jobs/ directory — rule is a no-op.
    {
      code: jobCode("sync-products"),
      filename: "/some/other/path/file.ts",
    },
    // Synthetic filename — rule is a no-op (can't scan disk).
    {
      code: jobCode("sync-products"),
    },
  ],
  invalid: [
    {
      code: jobCode("sync-products"),
      filename: duplicateNames.resolve("sync-products.ts"),
      errors: [{ messageId: "duplicateName" }],
    },
    {
      code: jobCode("sync-products"),
      filename: duplicateNested.resolve("sync-products.ts"),
      errors: [{ messageId: "duplicateName" }],
    },
    {
      code: jobCode("sync-products"),
      filename: duplicateViaSpecifier.resolve("sync-products.ts"),
      errors: [{ messageId: "duplicateName" }],
    },
  ],
})
