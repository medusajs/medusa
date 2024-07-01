import fs from "fs/promises"
import { OpenAPIObject, SchemaObject } from "openapi3-ts"
import { OperationObject } from "openapi3-ts/src/model/OpenApi"
import path from "path"
import { v4 as uid } from "uuid"
import { getTmpDirectory } from "../utils/fs-utils"
import { readYaml } from "../utils/yaml-utils"
import { readJson } from "../utils/json-utils"
import execa from "execa"

/**
 * OAS output directory
 * 
 * @privateRemarks
 * This should be the only directory OAS is loaded from for Medusa V2.
 * For now, we only use it if the --v2 flag it passed to the CLI tool.
 */
const oasOutputPath = path.resolve(
  __dirname, "..", "..", "..", "..", "..", "..", "www", "utils", "generated", "oas-output"
)
const basePath = path.resolve(__dirname, `../../`)

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

const listOperations = (oas: OpenAPIObject): OperationObject[] => {
  const operations: OperationObject[] = []
  for (const url in oas.paths) {
    if (oas.paths.hasOwnProperty(url)) {
      const path = oas.paths[url]
      for (const method in path) {
        if (path.hasOwnProperty(method)) {
          switch (method) {
            case "get":
            case "put":
            case "post":
            case "delete":
            case "options":
            case "head":
            case "patch":
              operations.push(path[method])
              break
          }
        }
      }
    }
  }
  return operations
}

describe("command oas", () => {
  let tmpDir: string

  beforeAll(async () => {
    tmpDir = await getTmpDirectory()
  })

  describe("--type admin", () => {
    let oas: OpenAPIObject

    /**
     * In a CI context, beforeAll might exceed the configured jest timeout.
     * Until we upgrade our jest version, the timeout error will be swallowed
     * and the test will fail in unexpected ways.
     */
    beforeAll(async () => {
      const outDir = path.resolve(tmpDir, uid())
      await runCLI("oas", ["--type", "admin", "--out-dir", outDir, "--local"])
      const generatedFilePath = path.resolve(outDir, "admin.oas.json")
      oas = (await readJson(generatedFilePath)) as OpenAPIObject
    })

    it("generates oas with admin routes only", async () => {
      const routes = Object.keys(oas.paths)
      expect(routes.includes("/admin/products")).toBeTruthy()
      expect(routes.includes("/store/products")).toBeFalsy()
    })

    it("generates oas using admin.oas.base.yaml", async () => {
      const yamlFilePath = path.resolve(
        oasOutputPath,
        "base",
        "admin.oas.base.yaml"
      )
      const oasBase = (await readYaml(yamlFilePath)) as OpenAPIObject
      expect(oas.info.title).toEqual(oasBase.info.title)
    })
  })

  describe("--type store", () => {
    let oas: OpenAPIObject

    beforeAll(async () => {
      const outDir = path.resolve(tmpDir, uid())
      await runCLI("oas", ["--type", "store", "--out-dir", outDir, "--local"])
      const generatedFilePath = path.resolve(outDir, "store.oas.json")
      oas = (await readJson(generatedFilePath)) as OpenAPIObject
    })

    it("generates oas with store routes only", async () => {
      const routes = Object.keys(oas.paths)
      expect(routes.includes("/admin/products")).toBeFalsy()
      expect(routes.includes("/store/products")).toBeTruthy()
    })

    it("generates oas using store.oas.base.yaml", async () => {
      const yamlFilePath = path.resolve(
        oasOutputPath,
        "base",
        "store.oas.base.yaml"
      )
      const oasBase = (await readYaml(yamlFilePath)) as OpenAPIObject
      expect(oas.info.title).toEqual(oasBase.info.title)
    })
  })

  describe("--type combined", () => {
    let oas: OpenAPIObject

    beforeAll(async () => {
      const outDir = path.resolve(tmpDir, uid())
      await runCLI("oas", ["--type", "combined", "--out-dir", outDir, "--local"])
      const generatedFilePath = path.resolve(outDir, "combined.oas.json")
      oas = (await readJson(generatedFilePath)) as OpenAPIObject
    })

    it("generates oas with admin and store routes", async () => {
      const routes = Object.keys(oas.paths)
      expect(routes.includes("/admin/products")).toBeTruthy()
      expect(routes.includes("/store/products")).toBeTruthy()
    })

    it("generates oas using default.oas.base.yaml", async () => {
      const yamlFilePath = path.resolve(
        basePath,
        "oas",
        "default.oas.base.yaml"
      )
      const oasBase = (await readYaml(yamlFilePath)) as OpenAPIObject
      expect(oas.info.title).toEqual(oasBase.info.title)
    })

    it("prefixes tags with api type", async () => {
      const found = (oas.tags ?? []).filter((tag) => {
        return !(tag.name.startsWith("Admin") || tag.name.startsWith("Store"))
      })
      expect(found).toEqual([])
    })

    it("prefixes route's tags with api type", async () => {
      const tags: string[] = listOperations(oas)
        .map((operation) => {
          return operation.tags ?? []
        })
        .flat()
      const found = tags.filter((tag) => {
        return !(tag.startsWith("Admin") || tag.startsWith("Store"))
      })
      expect(found).toEqual([])
    })

    it("prefixes route's operationId with api type", async () => {
      const operationIds: string[] = listOperations(oas)
        .map((operation) => operation.operationId)
        .filter((operationId): operationId is string => !!operationId)
      const found = operationIds.filter((tag) => {
        return !(tag.startsWith("Admin") || tag.startsWith("Store"))
      })
      expect(found).toEqual([])
    })

    it("combines components.schemas from admin and store", async () => {
      const schemas = Object.keys(oas.components?.schemas ?? {})
      expect(schemas.includes("AdminProductsListRes")).toBeTruthy()
      expect(schemas.includes("StoreProductsListRes")).toBeTruthy()
    })
  })

  /**
   * to optimize test suite time, we only test --paths with the store api
   */
  describe("--paths", () => {
    let oas: OpenAPIObject

    beforeAll(async () => {
      const fileContent = `
/** @oas [get] /foobar/tests
 *  operationId: GetFoobarTests
 */
/** @oas [get] /store/regions
 *  operationId: OverwrittenOperation
 */
/**
 *  @schema FoobarTestSchema
 *  type: object
 *  properties:
 *    foo:
 *      type: string
 */
/**
 *  @schema StoreRegionsListRes
 *  type: object
 *  properties:
 *    foo:
 *      type: string
 */
`
      const additionalPath = path.resolve(tmpDir, uid())
      const filePath = path.resolve(additionalPath, "foobar.ts")
      await fs.mkdir(additionalPath, { recursive: true })
      await fs.writeFile(filePath, fileContent, "utf8")

      const outDir = path.resolve(tmpDir, uid())
      await runCLI("oas", [
        "--type",
        "store",
        "--out-dir",
        outDir,
        "--paths",
        additionalPath,
        "--local"
      ])
      const generatedFilePath = path.resolve(outDir, "store.oas.json")
      oas = (await readJson(generatedFilePath)) as OpenAPIObject
    })

    it("should add new path to existing paths", async () => {
      const routes = Object.keys(oas.paths)
      expect(routes.includes("/store/products")).toBeTruthy()
      expect(routes.includes("/foobar/tests")).toBeTruthy()
    })

    it("should overwrite existing path", async () => {
      expect(oas.paths["/store/regions"]["get"].operationId).toBe(
        "OverwrittenOperation"
      )
    })

    it("should add new schema to existing schemas", async () => {
      const schemas = Object.keys(oas.components?.schemas ?? {})
      expect(schemas.includes("StoreProductsListRes")).toBeTruthy()
      expect(schemas.includes("FoobarTestSchema")).toBeTruthy()
    })

    it("should overwrite existing schema", async () => {
      const schema = oas.components?.schemas?.StoreRegionsListRes as
        | SchemaObject
        | undefined
      expect(schema?.properties?.foo).toBeDefined()
    })
  })

  /**
   * to optimize test suite time, we only test --base with the store api
   */
  describe("--base", () => {
    let oas: OpenAPIObject

    beforeAll(async () => {
      const fileContent = `
openapi: 3.1.0
info:
  version: 1.0.1
  title: Custom API
servers:
  - url: https://foobar.com
security:
  - api_key: []
externalDocs:
  url: https://docs.com
webhooks:
  "foo-hook":
    get:
      responses:
        "200":
          description: OK
tags:
  - name: Products
    description: Overwritten tag
  - name: FoobarTag
    description: Foobar tag description
paths:
  "/foobar/tests":
    get:
      operationId: GetFoobarTests
      responses:
        "200":
          description: OK
  "/store/regions":
    get:
      operationId: OverwrittenOperation
      responses:
        "200":
          description: OK
components:
  schemas:
    FoobarTestSchema:
      type: object
      properties:
        foo:
          type: string
    StoreRegionsListRes:
      type: object
      properties:
        foo:
          type: string
  callbacks:
    fooCallback:
      get:
        description: foo callback
  examples:
    fooExample:
      description: foo example
  headers:
    fooHeader:
      description: foo header
  links:
    fooLink:
      description: foo link
      operationRef: GetFoobarTests
  parameters:
    fooParameter:
      description: foo parameter
      name: foobar
      in: path
      required: true
      schema:
        type: string
  requestBodies:
    fooRequestBody:
      description: foo requestBody
      content:
        "application/octet-stream": { }
  responses:
    fooResponse:
      description: foo response
  securitySchemes:
    fooSecurity:
      description: foo security
      type: apiKey
      name: foo-api-key
      in: header
`
      const targetDir = path.resolve(tmpDir, uid())
      const filePath = path.resolve(targetDir, "custom.oas.base.yaml")
      await fs.mkdir(targetDir, { recursive: true })
      await fs.writeFile(filePath, fileContent, "utf8")

      const outDir = path.resolve(tmpDir, uid())
      await runCLI("oas", [
        "--type",
        "store",
        "--out-dir",
        outDir,
        "--base",
        filePath,
        "--local"
      ])
      const generatedFilePath = path.resolve(outDir, "store.oas.json")
      oas = (await readJson(generatedFilePath)) as OpenAPIObject
    })

    it("should add new path to existing paths", async () => {
      const routes = Object.keys(oas.paths)
      expect(routes.includes("/store/products")).toBeTruthy()
      expect(routes.includes("/foobar/tests")).toBeTruthy()
    })

    it("should overwrite existing path", async () => {
      expect(oas.paths["/store/regions"]["get"].operationId).toBe(
        "OverwrittenOperation"
      )
    })

    it("should add new schema to existing schemas", async () => {
      const schemas = Object.keys(oas.components?.schemas ?? {})
      expect(schemas.includes("StoreProductsListRes")).toBeTruthy()
      expect(schemas.includes("FoobarTestSchema")).toBeTruthy()
    })

    it("should overwrite existing schema", async () => {
      const schema = oas.components?.schemas?.StoreRegionsListRes as
        | SchemaObject
        | undefined
      expect(schema?.properties?.foo).toBeDefined()
    })

    it("should replace base properties", async () => {
      expect(oas.openapi).toBe("3.1.0")
      expect(oas.info).toEqual({ version: "1.0.1", title: "Custom API" })
      expect(oas.servers).toEqual([{ url: "https://foobar.com" }])
      expect(oas.security).toEqual([{ api_key: [] }])
      expect(oas.externalDocs).toEqual({ url: "https://docs.com" })
      expect(oas.webhooks).toEqual({
        "foo-hook": { get: { responses: { "200": { description: "OK" } } } },
      })
    })

    it("should add new tag", async () => {
      expect(oas.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "FoobarTag",
          }),
        ])
      )
    })

    it("should overwrite existing tag", async () => {
      expect(oas.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Products",
            description: "Overwritten tag",
          }),
        ])
      )
    })

    it("should add new components", async () => {
      const components = oas.components ?? {}
      expect(
        Object.keys(components.callbacks ?? {}).includes("fooCallback")
      ).toBeTruthy()
      expect(
        Object.keys(components.examples ?? {}).includes("fooExample")
      ).toBeTruthy()
      expect(
        Object.keys(components.headers ?? {}).includes("fooHeader")
      ).toBeTruthy()
      expect(
        Object.keys(components.links ?? {}).includes("fooLink")
      ).toBeTruthy()
      expect(
        Object.keys(components.parameters ?? {}).includes("fooParameter")
      ).toBeTruthy()
      expect(
        Object.keys(components.requestBodies ?? {}).includes("fooRequestBody")
      ).toBeTruthy()
      expect(
        Object.keys(components.responses ?? {}).includes("fooResponse")
      ).toBeTruthy()
      expect(
        Object.keys(components.securitySchemes ?? {}).includes("fooSecurity")
      ).toBeTruthy()
    })
  })

  describe("public OAS", () => {
    let oas: OpenAPIObject
    /**
     * In a CI context, beforeAll might exceed the configured jest timeout.
     * Until we upgrade our jest version, the timeout error will be swallowed
     * and the test will fail in unexpected ways.
     */
    beforeAll(async () => {
      const outDir = path.resolve(tmpDir, uid())
      await runCLI("oas", ["--type", "admin", "--out-dir", outDir])
      const generatedFilePath = path.resolve(outDir, "admin.oas.json")
      oas = (await readJson(generatedFilePath)) as OpenAPIObject
    })

    it("generates oas with admin routes only", async () => {
      const routes = Object.keys(oas.paths)
      expect(routes.includes("/admin/products")).toBeTruthy()
      expect(routes.includes("/store/products")).toBeFalsy()
    })    
  })

  describe("public OAS with base", () => {
    let oas: OpenAPIObject
    beforeAll(async () => {
      const fileContent = `
openapi: 3.1.0
info:
  version: 1.0.1
  title: Custom API
servers:
  - url: https://foobar.com
security:
  - api_key: []
externalDocs:
  url: https://docs.com
webhooks:
  "foo-hook":
    get:
      responses:
        "200":
          description: OK
tags:
  - name: Products
    description: Overwritten tag
  - name: FoobarTag
    description: Foobar tag description
paths:
  "/foobar/tests":
    get:
      operationId: GetFoobarTests
      responses:
        "200":
          description: OK
  "/store/regions":
    get:
      operationId: OverwrittenOperation
      responses:
        "200":
          description: OK
components:
  schemas:
    FoobarTestSchema:
      type: object
      properties:
        foo:
          type: string
    StoreRegionsListRes:
      type: object
      properties:
        foo:
          type: string
  callbacks:
    fooCallback:
      get:
        description: foo callback
  examples:
    fooExample:
      description: foo example
  headers:
    fooHeader:
      description: foo header
  links:
    fooLink:
      description: foo link
      operationRef: GetFoobarTests
  parameters:
    fooParameter:
      description: foo parameter
      name: foobar
      in: path
      required: true
      schema:
        type: string
  requestBodies:
    fooRequestBody:
      description: foo requestBody
      content:
        "application/octet-stream": { }
  responses:
    fooResponse:
      description: foo response
  securitySchemes:
    fooSecurity:
      description: foo security
      type: apiKey
      name: foo-api-key
      in: header
`
      const targetDir = path.resolve(tmpDir, uid())
      const filePath = path.resolve(targetDir, "custom.oas.base.yaml")
      await fs.mkdir(targetDir, { recursive: true })
      await fs.writeFile(filePath, fileContent, "utf8")

      const outDir = path.resolve(tmpDir, uid())
      await runCLI("oas", [
        "--type",
        "store",
        "--out-dir",
        outDir,
        "--base",
        filePath,
      ])
      const generatedFilePath = path.resolve(outDir, "store.oas.json")
      oas = (await readJson(generatedFilePath)) as OpenAPIObject
    })   

    it("should add new path to existing paths", async () => {
      const routes = Object.keys(oas.paths)
      expect(routes.includes("/store/products")).toBeTruthy()
      expect(routes.includes("/foobar/tests")).toBeTruthy()
    })

    it("should overwrite existing path", async () => {
      expect(oas.paths["/store/regions"]["get"].operationId).toBe(
        "OverwrittenOperation"
      )
    })

    it("should add new schema to existing schemas", async () => {
      const schemas = Object.keys(oas.components?.schemas ?? {})
      expect(schemas.includes("StoreProductsListRes")).toBeTruthy()
      expect(schemas.includes("FoobarTestSchema")).toBeTruthy()
    })

    it("should overwrite existing schema", async () => {
      const schema = oas.components?.schemas?.StoreRegionsListRes as
        | SchemaObject
        | undefined
      expect(schema?.properties?.foo).toBeDefined()
    })

    it("should replace base properties", async () => {
      expect(oas.openapi).toBe("3.1.0")
      expect(oas.info).toEqual({ version: "1.0.1", title: "Custom API" })
      expect(oas.servers).toEqual([{ url: "https://foobar.com" }])
      expect(oas.security).toEqual([{ api_key: [] }])
      expect(oas.externalDocs).toEqual({ url: "https://docs.com" })
      expect(oas.webhooks).toEqual({
        "foo-hook": { get: { responses: { "200": { description: "OK" } } } },
      })
    })

    it("should add new tag", async () => {
      expect(oas.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "FoobarTag",
          }),
        ])
      )
    })

    it("should overwrite existing tag", async () => {
      expect(oas.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Products",
            description: "Overwritten tag",
          }),
        ])
      )
    })

    it("should add new components", async () => {
      const components = oas.components ?? {}
      expect(
        Object.keys(components.callbacks ?? {}).includes("fooCallback")
      ).toBeTruthy()
      expect(
        Object.keys(components.examples ?? {}).includes("fooExample")
      ).toBeTruthy()
      expect(
        Object.keys(components.headers ?? {}).includes("fooHeader")
      ).toBeTruthy()
      expect(
        Object.keys(components.links ?? {}).includes("fooLink")
      ).toBeTruthy()
      expect(
        Object.keys(components.parameters ?? {}).includes("fooParameter")
      ).toBeTruthy()
      expect(
        Object.keys(components.requestBodies ?? {}).includes("fooRequestBody")
      ).toBeTruthy()
      expect(
        Object.keys(components.responses ?? {}).includes("fooResponse")
      ).toBeTruthy()
      expect(
        Object.keys(components.securitySchemes ?? {}).includes("fooSecurity")
      ).toBeTruthy()
    })
  })
})
