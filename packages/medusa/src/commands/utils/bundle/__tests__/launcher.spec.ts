import { execFileSync, spawnSync } from "child_process"
import { mkdtempSync, realpathSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import path from "path"
import { BUNDLE_FILE_NAME, BUNDLE_MARKER, LAUNCHER } from "../bundle-backend"

/**
 * Writes the launcher next to a stand-in for the bundle that prints the
 * command the launcher parsed.
 */
function createBundleDir() {
  const dir = realpathSync(mkdtempSync(path.join(tmpdir(), "medusa-bundle-")))
  writeFileSync(path.join(dir, BUNDLE_FILE_NAME), LAUNCHER)
  writeFileSync(
    path.join(dir, "medusa-bundle.main.js"),
    `var command = globalThis.__MEDUSA_BUNDLE_COMMAND__;
process.stdout.write(JSON.stringify({ command: command, keys: Object.keys(command.args), launcher: globalThis.__MEDUSA_BUNDLE_LAUNCHER__ }))`
  )
  return dir
}

function launch(dir: string, args: string[]) {
  const output = execFileSync(
    process.execPath,
    [path.join(dir, BUNDLE_FILE_NAME), ...args],
    { env: { ...process.env, MEDUSA_DISABLE_COMPILE_CACHE: "1" } }
  )
  return JSON.parse(output.toString())
}

describe("bundle launcher", () => {
  let dir: string

  beforeAll(() => {
    dir = createBundleDir()
  })

  it("starts with the marker that identifies a bundle", () => {
    expect(LAUNCHER.startsWith(BUNDLE_MARKER + "\n")).toBe(true)
  })

  it("runs start by default", () => {
    expect(launch(dir, []).command).toEqual({ name: "start", args: {} })
  })

  it("parses start's options", () => {
    const result = launch(dir, [
      "start",
      "-p",
      "8000",
      "--host=0.0.0.0",
      "--cluster",
    ])
    expect(result.command).toEqual({
      name: "start",
      args: { port: "8000", host: "0.0.0.0" },
    })
    // `--cluster` without a value is passed on as such
    expect(result.keys).toContain("cluster")
    expect(launch(dir, ["--cluster", "4"]).command).toEqual({
      name: "start",
      args: { cluster: "4" },
    })
  })

  it("parses db:migrate's options", () => {
    expect(
      launch(dir, [
        "db:migrate",
        "--execute-all-links",
        "--skip-scripts=false",
        "--concurrency",
        "4",
      ]).command
    ).toEqual({
      name: "db:migrate",
      args: { executeAllLinks: true, skipScripts: false, concurrency: 4 },
    })
  })

  it("supports the commands db:migrate runs in child processes", () => {
    expect(launch(dir, ["db:migrate:scripts"]).command).toEqual({
      name: "db:migrate:scripts",
      args: {},
    })
    expect(
      launch(dir, ["db:migrate:search", "--execute-safe-search"]).command
    ).toEqual({
      name: "db:migrate:search",
      args: { executeSafeSearch: true },
    })
  })

  it("exposes its own path, to run those child processes", () => {
    expect(launch(dir, []).launcher).toEqual(path.join(dir, BUNDLE_FILE_NAME))
  })

  it.each([
    [["develop"], "Unknown command 'develop'"],
    [["start", "--verbose"], "Unknown option '--verbose' for start"],
  ])("rejects %j", (args, message) => {
    const result = spawnSync(process.execPath, [
      path.join(dir, BUNDLE_FILE_NAME),
      ...args,
    ])
    expect(result.status).toBe(1)
    expect(result.stderr.toString()).toContain(message)
  })
})
