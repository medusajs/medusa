import { mkdtempSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import path from "path"
import {
  getBuildManifest,
  loadWorkflowFromManifest,
  loadWorkflowHooksFromManifest,
  setBuildManifest,
  setWorkflowBeingDefined,
} from "../build-manifest"

const LOADS_KEY = "__BUILD_MANIFEST_SPEC_LOADS__"

function writeModule(dir: string, name: string, body = "") {
  const file = path.join(dir, `${name}.js`)
  writeFileSync(
    file,
    `globalThis.${LOADS_KEY}.push(${JSON.stringify(name)});\n${body}`
  )
  return file
}

describe("build manifest", () => {
  let dir: string
  let loads: string[]

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "build-manifest-"))
    loads = []
    ;(globalThis as any)[LOADS_KEY] = loads
  })

  afterEach(() => {
    setBuildManifest(undefined)
    delete (globalThis as any)[LOADS_KEY]
  })

  it("stores the manifest globally", () => {
    expect(getBuildManifest()).toBeUndefined()
    setBuildManifest({ workflows: {} })
    expect(getBuildManifest()).toEqual({ workflows: {} })
  })

  describe("loadWorkflowFromManifest", () => {
    it("loads the file that defines the workflow", () => {
      const file = writeModule(dir, "workflow")
      setBuildManifest({ workflows: { "my-workflow": file } })

      expect(loadWorkflowFromManifest("my-workflow")).toBe(true)
      expect(loads).toEqual(["workflow"])
    })

    it("returns false for workflows not in the manifest", () => {
      expect(loadWorkflowFromManifest("my-workflow")).toBe(false)

      setBuildManifest({ workflows: {} })
      expect(loadWorkflowFromManifest("my-workflow")).toBe(false)
    })

    it("doesn't recurse when the file looks the workflow up while loading", () => {
      const file = writeModule(
        dir,
        "recursive-workflow",
        `globalThis.${LOADS_KEY}.push(require(${JSON.stringify(
          require.resolve("../build-manifest")
        )}).loadWorkflowFromManifest("recursive"));`
      )
      setBuildManifest({ workflows: { recursive: file } })

      expect(loadWorkflowFromManifest("recursive")).toBe(true)
      expect(loads).toEqual(["recursive-workflow", false])
    })
  })

  describe("loadWorkflowHooksFromManifest", () => {
    it("loads each hook file once", () => {
      const first = writeModule(dir, "hook-a")
      const second = writeModule(dir, "hook-b")
      setBuildManifest({
        workflowHooks: { "hooked-workflow": [first, second] },
      })

      loadWorkflowHooksFromManifest("hooked-workflow")
      loadWorkflowHooksFromManifest("hooked-workflow")

      expect(loads).toEqual(["hook-a", "hook-b"])
    })

    it("skips hooks while the workflow is being defined", () => {
      const file = writeModule(dir, "hook-defining")
      setBuildManifest({ workflowHooks: { "defining-workflow": [file] } })

      setWorkflowBeingDefined("defining-workflow", true)
      loadWorkflowHooksFromManifest("defining-workflow")
      expect(loads).toEqual([])

      setWorkflowBeingDefined("defining-workflow", false)
      loadWorkflowHooksFromManifest("defining-workflow")
      expect(loads).toEqual(["hook-defining"])
    })

    it("retries a hook file that failed to load", () => {
      const file = path.join(dir, "hook-failing.js")
      writeFileSync(file, `throw new Error("not yet")`)
      setBuildManifest({ workflowHooks: { "failing-workflow": [file] } })

      expect(() => loadWorkflowHooksFromManifest("failing-workflow")).toThrow(
        "not yet"
      )
      expect(() => loadWorkflowHooksFromManifest("failing-workflow")).toThrow(
        "not yet"
      )
    })
  })
})
