const { existsSync } = require("fs")
const sysPath = require("path")
const RefParser = require("@apidevtools/json-schema-ref-parser")

const compareSchema = require("../utils/compare-schema")

const adminSpec = require("../../../docs/api/admin-spec3.json")

let dereffed
const getDereffed = async () => {
  if (dereffed) {
    return dereffed
  }

  dereffed = await RefParser.dereference(adminSpec)
  return dereffed
}

describe("match", () => {
  for (const [path, methods] of Object.entries(adminSpec.paths)) {
    if (methods.get) {
      const operation = methods.get
      const fixPath = sysPath.join(
        __dirname,
        "..",
        "..",
        "..",
        "docs",
        "api",
        "fixtures",
        "admin",
        `${operation.operationId}.json`
      )
      const resolved = sysPath.resolve(fixPath)
      if (existsSync(resolved)) {
        const fixture = require(resolved)
        if (fixture) {
          test(operation.operationId, async () => {
            const dereffed = await getDereffed()
            const responseSchema =
              dereffed.paths[path].get.responses["200"].content[
                "application/json"
              ].schema

            compareSchema(fixture, responseSchema)
          })
        }
      } else {
        console.warn(`No fixture found for ADMIN: ${operation.operationId}`)
      }
    }
  }
})
