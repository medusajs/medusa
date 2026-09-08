import fs from "fs"
import os from "os"
import path from "path"

const addPackagesMock = jest.fn()
const execSyncMock = jest.fn()

jest.mock("yalc", () => ({
  addPackages: (...args: any[]) => addPackagesMock(...args),
}))

jest.mock("child_process", () => ({
  execSync: (...args: any[]) => execSyncMock(...args),
}))

jest.mock("@medusajs/framework/logger", () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}))

import localAddPlugin, { detectPackageManager, findInstallRoot } from "../add"

const PLUGIN_NAME = "medusa-plugin-under-test"

let baseDir: string

function write(relativePath: string, contents: string) {
  const absolutePath = path.join(baseDir, relativePath)
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  fs.writeFileSync(absolutePath, contents)
}

function writeJson(relativePath: string, contents: any) {
  write(relativePath, JSON.stringify(contents))
}

/**
 * Emulates what yalc does when it adds a package: it copies the package into
 * "<workingDir>/.yalc" AND into "<workingDir>/node_modules".
 */
function emulateYalcAdd(workingDirRelative: string) {
  writeJson(
    path.join(workingDirRelative, `.yalc/${PLUGIN_NAME}/package.json`),
    {
      name: PLUGIN_NAME,
      version: "1.0.0",
      dependencies: { "lodash.kebabcase": "^4.1.1" },
    }
  )
  writeJson(
    path.join(workingDirRelative, `node_modules/${PLUGIN_NAME}/package.json`),
    { name: PLUGIN_NAME, version: "1.0.0" }
  )
}

beforeEach(() => {
  baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "medusa-plugin-add-"))
  addPackagesMock.mockReset()
  execSyncMock.mockReset()
  // `yarn --version`
  execSyncMock.mockReturnValue("4.5.0\n")
})

afterEach(() => {
  fs.rmSync(baseDir, { recursive: true, force: true })
})

describe("findInstallRoot", () => {
  test("returns the app directory for a standalone project", () => {
    writeJson("app/package.json", { name: "my-app" })
    write("app/package-lock.json", "{}")

    expect(findInstallRoot(path.join(baseDir, "app"))).toEqual(
      path.join(baseDir, "app")
    )
  })

  test("walks up to a package.json declaring workspaces", () => {
    writeJson("package.json", { name: "root", workspaces: ["apps/*"] })
    write("yarn.lock", "")
    writeJson("apps/backend/package.json", { name: "backend" })

    expect(findInstallRoot(path.join(baseDir, "apps/backend"))).toEqual(baseDir)
  })

  test("walks up to a pnpm-workspace.yaml", () => {
    writeJson("package.json", { name: "root" })
    write("pnpm-workspace.yaml", "packages:\n  - 'apps/*'\n")
    writeJson("apps/backend/package.json", { name: "backend" })

    expect(findInstallRoot(path.join(baseDir, "apps/backend"))).toEqual(baseDir)
  })

  test("walks up to a lockfile when there is no workspaces field", () => {
    writeJson("package.json", { name: "root" })
    write("package-lock.json", "{}")
    writeJson("apps/backend/package.json", { name: "backend" })

    expect(findInstallRoot(path.join(baseDir, "apps/backend"))).toEqual(baseDir)
  })

  test("prefers the nearest workspaces declaration", () => {
    writeJson("package.json", { name: "outer", workspaces: ["*"] })
    writeJson("mono/package.json", { name: "mono", workspaces: ["apps/*"] })
    writeJson("mono/apps/backend/package.json", { name: "backend" })

    expect(findInstallRoot(path.join(baseDir, "mono/apps/backend"))).toEqual(
      path.join(baseDir, "mono")
    )
  })

  test("does not walk up past an app that has its own lockfile", () => {
    writeJson("package.json", { name: "root" })
    write("package-lock.json", "{}")
    writeJson("apps/backend/package.json", { name: "backend" })
    write("apps/backend/yarn.lock", "")

    expect(findInstallRoot(path.join(baseDir, "apps/backend"))).toEqual(
      path.join(baseDir, "apps/backend")
    )
  })
})

describe("detectPackageManager", () => {
  test("detects pnpm from the workspace root lockfile", () => {
    writeJson("package.json", { name: "root", workspaces: ["apps/*"] })
    write("pnpm-lock.yaml", "")
    writeJson("apps/backend/package.json", { name: "backend" })

    expect(
      detectPackageManager(path.join(baseDir, "apps/backend"), baseDir)
    ).toEqual("pnpm")
  })

  test("falls back to the packageManager field", () => {
    writeJson("package.json", {
      name: "root",
      workspaces: ["apps/*"],
      packageManager: "yarn@4.5.0",
    })
    writeJson("apps/backend/package.json", { name: "backend" })

    expect(
      detectPackageManager(path.join(baseDir, "apps/backend"), baseDir)
    ).toEqual("yarn")
  })
})

describe("localAddPlugin", () => {
  test("runs an install so the plugin's own dependencies are installed", async () => {
    writeJson("app/package.json", { name: "my-app" })
    write("app/package-lock.json", "{}")
    const directory = path.join(baseDir, "app")

    addPackagesMock.mockImplementation(async () => emulateYalcAdd("app"))

    await localAddPlugin({ directory, plugin_names: [PLUGIN_NAME] })

    /**
     * Without this install the plugin's non-peer runtime dependencies are never
     * placed on disk and the app crashes with MODULE_NOT_FOUND when loading the
     * plugin's modules.
     */
    expect(execSyncMock).toHaveBeenCalledWith("npm install", {
      cwd: directory,
      stdio: "inherit",
    })
  })

  test("never asks yalc to run the install", async () => {
    writeJson("app/package.json", { name: "my-app" })
    write("app/yarn.lock", "")
    const directory = path.join(baseDir, "app")

    addPackagesMock.mockImplementation(async () => emulateYalcAdd("app"))

    await localAddPlugin({ directory, plugin_names: [PLUGIN_NAME] })

    /**
     * yalc's update command for yarn is "yarn upgrade", which is not an install
     * in yarn 2+. We always run the install ourselves instead. `pure` has to be
     * disabled explicitly, otherwise yalc silently skips writing the dependency
     * for anything that declares workspaces.
     */
    expect(addPackagesMock).toHaveBeenCalledWith([PLUGIN_NAME], {
      workingDir: directory,
      replace: true,
      pure: false,
      update: false,
    })

    expect(execSyncMock).toHaveBeenCalledWith("yarn install --no-immutable", {
      cwd: directory,
      stdio: "inherit",
    })
  })

  test("installs at the workspace root in a monorepo", async () => {
    writeJson("package.json", { name: "root", workspaces: ["apps/*"] })
    write("yarn.lock", "")
    writeJson("apps/backend/package.json", { name: "backend" })
    const directory = path.join(baseDir, "apps/backend")

    addPackagesMock.mockImplementation(async () =>
      emulateYalcAdd("apps/backend")
    )

    await localAddPlugin({ directory, plugin_names: [PLUGIN_NAME] })

    expect(execSyncMock).toHaveBeenCalledWith("yarn install --no-immutable", {
      cwd: baseDir,
      stdio: "inherit",
    })
  })

  test("leaves exactly one copy of the plugin in a monorepo", async () => {
    writeJson("package.json", { name: "root", workspaces: ["apps/*"] })
    write("yarn.lock", "")
    writeJson("apps/backend/package.json", { name: "backend" })
    const directory = path.join(baseDir, "apps/backend")

    addPackagesMock.mockImplementation(async () =>
      emulateYalcAdd("apps/backend")
    )

    await localAddPlugin({ directory, plugin_names: [PLUGIN_NAME] })

    /**
     * yalc's raw copy is removed so the package manager is the only owner of
     * the installed plugin. Otherwise the app would load a copy that
     * "plugin:develop" does not refresh, and run stale code.
     */
    expect(
      fs.existsSync(path.join(directory, "node_modules", PLUGIN_NAME))
    ).toBe(false)
    expect(fs.existsSync(path.join(directory, ".yalc", PLUGIN_NAME))).toBe(true)
  })

  test("keeps yalc's copy in a standalone project", async () => {
    writeJson("app/package.json", { name: "my-app" })
    write("app/package-lock.json", "{}")
    const directory = path.join(baseDir, "app")

    addPackagesMock.mockImplementation(async () => emulateYalcAdd("app"))

    await localAddPlugin({ directory, plugin_names: [PLUGIN_NAME] })

    expect(
      fs.existsSync(path.join(directory, "node_modules", PLUGIN_NAME))
    ).toBe(true)
  })
})
