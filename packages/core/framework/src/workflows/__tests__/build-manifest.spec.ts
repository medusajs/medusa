import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  setBuildManifest,
} from "@medusajs/utils"
import { mkdtempSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { asValue } from "../../deps/awilix"
import { logger } from "../../logger"
import { WorkflowLoader } from "../workflow-loader"

const LOADS_KEY = "__WORKFLOW_MANIFEST_SPEC_LOADS__"

describe("WorkflowLoader with a build manifest", () => {
  let dir: string
  let loads: string[]

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "workflow-manifest-"))
    loads = []
    ;(globalThis as any)[LOADS_KEY] = loads
  })

  afterEach(() => {
    setBuildManifest(undefined)
    delete (globalThis as any)[LOADS_KEY]
  })

  function load() {
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))
    return new WorkflowLoader(dir, container).load()
  }

  function write(name: string) {
    const file = join(dir, name)
    writeFileSync(file, `globalThis.${LOADS_KEY}.push(${JSON.stringify(name)})`)
    return file
  }

  it("imports every workflow file when there is no manifest", async () => {
    write("a.js")
    write("b.js")
    await load()

    expect(loads.sort()).toEqual(["a.js", "b.js"])
  })

  it("does not import the files listed as lazy", async () => {
    const lazy = write("lazy.js")
    write("eager.js")
    setBuildManifest({ lazyWorkflowFiles: [lazy] })
    await load()

    expect(loads).toEqual(["eager.js"])
  })
})
