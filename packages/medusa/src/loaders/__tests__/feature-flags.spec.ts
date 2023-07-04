import { resolve } from "path"
import { mkdirSync, rmSync, writeFileSync } from "fs"

import loadFeatureFlags from "../feature-flags"

const distTestTargetDirectorPath = resolve(__dirname, "__ff-test__")

const getFolderTestTargetDirectoryPath = (folderName: string): string => {
  return resolve(distTestTargetDirectorPath, folderName)
}

const buildFeatureFlag = (
  key: string,
  defaultVal: string | boolean
): string => {
  const snakeCaseKey = key.replace(/-/g, "_")

  return `
    export default {
      description: "${key} descr",
      key: "${snakeCaseKey}",
      env_key: "MEDUSA_FF_${snakeCaseKey.toUpperCase()}",
      default_val: ${defaultVal},
    }
  `
}

describe("feature flags", () => {
  const OLD_ENV = { ...process.env }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    process.env = { ...OLD_ENV }

    rmSync(distTestTargetDirectorPath, { recursive: true, force: true })

    mkdirSync(getFolderTestTargetDirectoryPath("project"), {
      mode: "777",
      recursive: true,
    })

    mkdirSync(getFolderTestTargetDirectoryPath("flags"), {
      mode: "777",
      recursive: true,
    })
  })

  afterAll(() => {
    process.env = OLD_ENV
    rmSync(distTestTargetDirectorPath, { recursive: true, force: true })
  })

  it("should load the flag from project", async () => {
    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("flags"), "flag-1.js"),
      buildFeatureFlag("flag-1", true)
    )

    const flags = await loadFeatureFlags(
      { featureFlags: { flag_1: false } },
      undefined,
      getFolderTestTargetDirectoryPath("flags")
    )

    expect(flags.isFeatureEnabled("flag_1")).toEqual(false)
  })

  it("should load the default feature flags", async () => {
    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("flags"), "flag-1.js"),
      buildFeatureFlag("flag-1", true)
    )

    const flags = await loadFeatureFlags(
      {},
      undefined,
      getFolderTestTargetDirectoryPath("flags")
    )

    expect(flags.isFeatureEnabled("flag_1")).toEqual(true)
  })

  it("should load the flag from env", async () => {
    process.env.MEDUSA_FF_FLAG_1 = "false"

    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("flags"), "flag-1.js"),
      buildFeatureFlag("flag-1", true)
    )

    const flags = await loadFeatureFlags(
      {},
      undefined,
      getFolderTestTargetDirectoryPath("flags")
    )

    expect(flags.isFeatureEnabled("flag_1")).toEqual(false)
  })

  it("should load mix of flags", async () => {
    process.env.MEDUSA_FF_FLAG_3 = "false"

    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("flags"), "flag-1.js"),
      buildFeatureFlag("flag-1", true)
    )

    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("flags"), "flag-2.js"),
      buildFeatureFlag("flag-2", true)
    )

    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("flags"), "flag-3.js"),
      buildFeatureFlag("flag-3", true)
    )

    const flags = await loadFeatureFlags(
      { featureFlags: { flag_2: false } },
      undefined,
      getFolderTestTargetDirectoryPath("flags")
    )

    expect(flags.isFeatureEnabled("flag_1")).toEqual(true)
    expect(flags.isFeatureEnabled("flag_2")).toEqual(false)
    expect(flags.isFeatureEnabled("flag_3")).toEqual(false)
  })
})
