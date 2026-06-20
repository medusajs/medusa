/**
 * Shared test utilities for the rule specs.
 *
 * This file lives at `src/test-utils.ts` (not under a `__tests__/` directory)
 * on purpose: Jest's default `testMatch` treats every `.ts` file inside a
 * `__tests__/` folder as a test suite, so a helper placed there would fail as
 * an "empty test suite." It is excluded from the build via `tsconfig.json`.
 */
import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import { RuleTester } from "@typescript-eslint/rule-tester"

/**
 * Wires `@typescript-eslint/rule-tester`'s static lifecycle hooks to Jest's
 * globals and returns a configured `RuleTester`. Every spec needs this same
 * four-line dance before constructing a tester — call this instead.
 */
export function createRuleTester(
  config?: ConstructorParameters<typeof RuleTester>[0]
): RuleTester {
  RuleTester.afterAll = afterAll
  RuleTester.describe = describe
  RuleTester.it = it
  RuleTester.itOnly = it.only
  return new RuleTester(config)
}

/** A single file to materialize inside a fixture workspace. */
export type FixtureFile = { rel: string; content: string }

export interface FixtureWorkspace {
  /** Absolute path of the temp root (the `mkdtemp` directory). */
  root: string
  /** Absolute path of `<root>/<subPath>`, where the fixture files live. */
  dir: string
  /** Resolves a path relative to `dir` into an absolute path. */
  resolve: (rel: string) => string
}

const tempRoots: string[] = []

/**
 * Creates a throwaway directory tree on disk for cross-file rules that read
 * sibling files (e.g. `scheduled-job-name-unique`,
 * `loader-must-be-exported-in-module-definition`, `use-validated-body-or-query`).
 *
 * Each `files` entry is written to `<tmp>/<subPath>/<rel>`, creating parent
 * directories as needed. Lint the file under test with an absolute filename via
 * the returned `resolve` so the rule's disk scan sees the same content.
 *
 * Register `cleanupFixtureWorkspaces` in the spec's `afterAll` to remove the
 * directories when the suite finishes.
 *
 * @param subPath POSIX-style path under the temp root, e.g. `"src/jobs"`.
 */
export function createFixtureWorkspace(
  subPath: string,
  files: FixtureFile[]
): FixtureWorkspace {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "medusa-eslint-"))
  tempRoots.push(root)
  const dir = path.join(root, ...subPath.split("/"))
  fs.mkdirSync(dir, { recursive: true })
  for (const f of files) {
    const abs = path.join(dir, f.rel)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, f.content, "utf8")
  }
  return {
    root,
    dir,
    resolve: (rel: string) => path.join(dir, rel),
  }
}

/**
 * Removes every fixture workspace created via `createFixtureWorkspace` in the
 * current test file. Safe to call when none were created — pass it directly to
 * `afterAll(cleanupFixtureWorkspaces)`.
 */
export function cleanupFixtureWorkspaces(): void {
  while (tempRoots.length) {
    const dir = tempRoots.pop()!
    try {
      fs.rmSync(dir, { recursive: true, force: true })
    } catch {
      // ignore
    }
  }
}
