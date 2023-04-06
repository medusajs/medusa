import { exists, getTmpDirectory } from "../utils/fs-utils"
import { writeJson } from "../utils/json-utils"
import { OpenAPIObject } from "openapi3-ts"
import path from "path"
import { v4 as uid } from "uuid"
import { readYaml, writeYaml } from "../utils/yaml-utils"
import { mkdir, readdir } from "fs/promises"
import {
  formatHintRecommendation,
  getCircularPatchRecommendation,
  getCircularReferences,
} from "../utils/circular-patch-utils"
import execa from "execa"

const basePath = path.resolve(__dirname, `../../../`)

export const runCLI = async (command: string, options: string[] = []) => {
  const params = ["run", "medusa-oas", command, ...options]
  try {
    const { all: logs } = await execa("yarn", params, {
      cwd: basePath,
      all: true,
    })
  } catch (err) {
    throw new Error(err.message + err.all)
  }
}

export const getBaseOpenApi = (): OpenAPIObject => {
  return {
    openapi: "3.0.0",
    info: {
      title: "Test",
      version: "1.0.0",
    },
    paths: {},
    components: {},
  }
}

describe("command docs", () => {
  let tmpDir: string
  let openApi: OpenAPIObject

  beforeAll(async () => {
    tmpDir = await getTmpDirectory()
  })

  beforeEach(async () => {
    openApi = getBaseOpenApi()
  })

  describe("basic usage", () => {
    let srcFile: string

    beforeAll(async () => {
      openApi = getBaseOpenApi()
      openApi.components = {
        schemas: {
          Order: {
            type: "object",
          },
        },
      }
      const outDir = path.resolve(tmpDir, uid())
      await mkdir(outDir, { recursive: true })
      srcFile = path.resolve(outDir, "store.oas.json")
      await writeJson(srcFile, openApi)
    })

    it("should generate docs", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await runCLI("docs", ["--src-file", srcFile, "--out-dir", outDir])
      const generatedFilePath = path.resolve(outDir, "openapi.yaml")
      const oas = (await readYaml(generatedFilePath)) as OpenAPIObject
      const files = await readdir(outDir)
      expect(oas.components?.schemas?.Order).toBeDefined()
      expect(files.length).toBe(1)
    })

    it("should clean output directory", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await mkdir(outDir, { recursive: true })
      await writeJson(path.resolve(outDir, "test.json"), { foo: "bar" })
      await runCLI("docs", [
        "--src-file",
        srcFile,
        "--out-dir",
        outDir,
        "--clean",
      ])
      const files = await readdir(outDir)
      expect(files.includes("test.json")).toBeFalsy()
      expect(files.length).toBe(1)
    })

    it("should not output any files", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await runCLI("docs", [
        "--src-file",
        srcFile,
        "--out-dir",
        outDir,
        "--dry-run",
      ])
      const outDirExists = await exists(outDir)
      expect(outDirExists).toBeFalsy()
    })

    it("should split output into multiple files and directories", async () => {
      const outDir = path.resolve(tmpDir, uid())
      /**
       * For split to output files, we need to not be in test mode
       * See https://github.com/Redocly/redocly-cli/blob/v1.0.0-beta.125/packages/cli/src/utils.ts#L206-L215
       */
      const previousEnv = process.env.NODE_ENV
      process.env.NODE_ENV = "development"
      await runCLI("docs", [
        "--src-file",
        srcFile,
        "--out-dir",
        outDir,
        "--split",
        "--clean",
      ])
      process.env.NODE_ENV = previousEnv
      const oasFileExists = await exists(path.resolve(outDir, "openapi.yaml"))
      const outFileExists = await exists(
        path.resolve(outDir, "components/schemas/Order.yaml")
      )
      expect(oasFileExists).toBeTruthy()
      expect(outFileExists).toBeTruthy()
    })

    it("should generate static HTML docs", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await runCLI("docs", [
        "--src-file",
        srcFile,
        "--out-dir",
        outDir,
        "--html",
      ])
      const generatedFilePath = path.resolve(outDir, "index.html")
      const htmlFileExists = await exists(generatedFilePath)
      expect(htmlFileExists).toBeTruthy()
    })
  })

  describe("--config", () => {
    let srcFile: string
    let configFile: string
    let configYamlFile: string

    beforeAll(async () => {
      openApi = getBaseOpenApi()
      openApi.components = {
        schemas: {
          Customer: {
            type: "object",
            properties: {
              address: {
                $ref: "#/components/schemas/Address",
              },
            },
          },
          TestOrder: {
            type: "object",
            properties: {
              address: {
                $ref: "#/components/schemas/Address",
              },
            },
          },
          Address: {
            type: "object",
            properties: {
              /**
               * We expect this circular reference to already be handled by
               * our CLI's default redocly-config.yaml
               */
              customer: {
                $ref: "#/components/schemas/Customer",
              },
              /**
               * We expect this circular reference to not be handled.
               */
              test_order: {
                $ref: "#/components/schemas/TestOrder",
              },
            },
          },
        },
      }
      const config = {
        decorators: {
          "medusa/circular-patch": {
            schemas: {
              Address: ["TestOrder"],
            },
          },
        },
      }
      const outDir = path.resolve(tmpDir, uid())
      await mkdir(outDir, { recursive: true })
      srcFile = path.resolve(outDir, "store.oas.json")
      await writeJson(srcFile, openApi)
      configFile = path.resolve(outDir, "redocly-config.json")
      await writeJson(configFile, config)
      configYamlFile = path.resolve(outDir, "redocly-config.yaml")
      await writeYaml(configYamlFile, config)
    })

    it("should fail with unhandled circular reference", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await expect(
        runCLI("docs", [
          "--src-file",
          srcFile,
          "--out-dir",
          outDir,
          "--dry-run",
        ])
      ).rejects.toThrow("Unhandled circular references")
    })

    it("should succeed with patched circular reference", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await expect(
        runCLI("docs", [
          "--src-file",
          srcFile,
          "--out-dir",
          outDir,
          "--config",
          configFile,
          "--dry-run",
        ])
      ).resolves.not.toThrow()
    })

    it("should succeed when config is of type yaml", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await expect(
        runCLI("docs", [
          "--src-file",
          srcFile,
          "--out-dir",
          outDir,
          "--config",
          configYamlFile,
          "--dry-run",
        ])
      ).resolves.not.toThrow()
    })

    it("should fail when config is not a file", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await expect(
        runCLI("docs", [
          "--src-file",
          srcFile,
          "--out-dir",
          outDir,
          "--dry-run",
          "--config",
          outDir,
        ])
      ).rejects.toThrow("--config must be a file")
    })

    it("should fail when config is not of supported file type", async () => {
      const outDir = path.resolve(tmpDir, uid())
      await mkdir(outDir, { recursive: true })
      const tmpFile = path.resolve(outDir, "tmp.txt")
      await writeJson(tmpFile, { foo: "bar" })
      await expect(
        runCLI("docs", [
          "--src-file",
          srcFile,
          "--out-dir",
          outDir,
          "--dry-run",
          "--config",
          tmpFile,
        ])
      ).rejects.toThrow("--config file must be of type .json or .yaml")
    })
  })

  describe("circular references", () => {
    let srcFile: string

    beforeAll(async () => {
      openApi = getBaseOpenApi()
      openApi.components = {
        schemas: {
          Customer: {
            type: "object",
            properties: {
              address: {
                $ref: "#/components/schemas/Address",
              },
            },
          },
          TestOrder: {
            type: "object",
            properties: {
              address: {
                $ref: "#/components/schemas/Address",
              },
            },
          },
          Address: {
            type: "object",
            properties: {
              customer: {
                $ref: "#/components/schemas/Customer",
              },
              test_order: {
                $ref: "#/components/schemas/TestOrder",
              },
            },
          },
        },
      }
      const outDir = path.resolve(tmpDir, uid())
      await mkdir(outDir, { recursive: true })
      srcFile = path.resolve(outDir, "store.oas.json")
      await writeJson(srcFile, openApi)
    })

    it("should find circular references", async () => {
      const { circularRefs, oas } = await getCircularReferences(srcFile)
      expect(circularRefs.length).toBe(2)
      expect(circularRefs).toEqual(
        expect.arrayContaining([
          "#/components/schemas/Address/properties/customer",
          "#/components/schemas/TestOrder/properties/address",
        ])
      )
    })

    it("should recommend which schemas to patch to resolve circular references", async () => {
      /**
       * The recommendation is heavily influenced but the dereference operation
       * from @readme/json-schema-ref-parser. It's not an exact science and the
       * results may vary between versions.
       */
      const { circularRefs, oas } = await getCircularReferences(srcFile)
      const recommendation = getCircularPatchRecommendation(circularRefs, oas)
      expect(recommendation).toEqual(
        expect.objectContaining({
          Address: expect.arrayContaining(["Customer"]),
          TestOrder: expect.arrayContaining(["Address"]),
        })
      )
    })

    it("should format hint", async () => {
      const { circularRefs, oas } = await getCircularReferences(srcFile)
      const recommendation = getCircularPatchRecommendation(circularRefs, oas)
      const hint = formatHintRecommendation(recommendation)
      expect(hint).toEqual(
        expect.stringContaining(`decorators:
  medusa/circular-patch:
    schemas:
      Address:
        - Customer
      TestOrder:
        - Address
`)
      )
    })
  })
})
