import {
  CompatibilityChecker,
  type CheckPair,
  type CompatibilityResult,
} from "../core/compatibility-checker"
import { createTestProgram } from "./utils/ts-utils"

function runCheck(
  zodSource: string,
  zodTypeName: string,
  httpSource: string,
  httpTypeName: string,
  lenient = false
): CompatibilityResult {
  const zodFile = "zod.ts"
  const httpFile = "http.ts"

  const { program, checker, getType } = createTestProgram({
    [zodFile]: zodSource,
    [httpFile]: httpSource,
  })

  const zodType = getType(zodFile, zodTypeName)

  const pairs: CheckPair[] = [
    {
      validatorName: zodTypeName,
      validatorFile: zodFile,
      httpTypeName,
      resolvedZodType: zodType,
      httpTypeFile: httpFile,
      hasFindParams: false,
      hasSelectParams: false,
    },
  ]

  const compatChecker = new CompatibilityChecker(program, checker)
  const results = compatChecker.check(pairs, [httpFile], lenient)
  return results[0]
}

// ---------------------------------------------------------------------------
// CompatibilityChecker.formatResult
// ---------------------------------------------------------------------------

describe("CompatibilityChecker.formatResult", () => {
  it("returns empty string for passing results when not verbose", () => {
    const result: CompatibilityResult = {
      httpTypeName: "AdminCreateProduct",
      httpTypeFile: "packages/core/types/src/http/product/admin/payloads.ts",
      validatorName: "AdminCreateProduct",
      validatorFile: "packages/medusa/src/api/admin/products/validators.ts",
      passed: true,
      typeNotFound: false,
      missingFields: [],
      typeMismatchFields: [],
      extraFields: [],
    }
    expect(CompatibilityChecker.formatResult(result, false)).toBe("")
  })

  it("shows PASS line for passing results in verbose mode", () => {
    const result: CompatibilityResult = {
      httpTypeName: "AdminCreateProduct",
      httpTypeFile: "packages/core/types/src/http/product/admin/payloads.ts",
      validatorName: "AdminCreateProduct",
      validatorFile: "packages/medusa/src/api/admin/products/validators.ts",
      passed: true,
      typeNotFound: false,
      missingFields: [],
      typeMismatchFields: [],
      extraFields: [],
    }
    expect(CompatibilityChecker.formatResult(result, true)).toContain("PASS")
    expect(CompatibilityChecker.formatResult(result, true)).toContain(
      "AdminCreateProduct"
    )
  })

  it("shows FAIL line with missing fields for failures", () => {
    const result: CompatibilityResult = {
      httpTypeName: "AdminUpdateCustomer",
      httpTypeFile: "packages/core/types/src/http/customer/admin/payloads.ts",
      validatorName: "AdminUpdateCustomer",
      validatorFile: "packages/medusa/src/api/admin/customers/validators.ts",
      passed: false,
      typeNotFound: false,
      missingFields: [
        { fieldName: "email", expectedType: "string | null | undefined" },
      ],
      typeMismatchFields: [],
      extraFields: [],
    }
    const output = CompatibilityChecker.formatResult(result, false)
    expect(output).toContain("FAIL")
    expect(output).toContain("AdminUpdateCustomer")
    expect(output).toContain("Missing field: email")
    expect(output).toContain("string | null | undefined")
  })

  it("shows type mismatch details for mismatch failures", () => {
    const result: CompatibilityResult = {
      httpTypeName: "AdminCreateOrder",
      httpTypeFile: "packages/core/types/src/http/order/admin/payloads.ts",
      validatorName: "AdminCreateOrder",
      validatorFile: "packages/medusa/src/api/admin/orders/validators.ts",
      passed: false,
      typeNotFound: false,
      missingFields: [],
      typeMismatchFields: [
        {
          fieldName: "status",
          expectedType: "string",
          actualType: "OrderStatus",
        },
      ],
      extraFields: [],
    }
    const output = CompatibilityChecker.formatResult(result, false)
    expect(output).toContain("Type mismatch: status")
    expect(output).toContain("string")
    expect(output).toContain("OrderStatus")
  })

  it("always shows HTTP-only fields in failing results", () => {
    const result: CompatibilityResult = {
      httpTypeName: "AdminCreateProduct",
      httpTypeFile: "packages/core/types/src/http/product/admin/payloads.ts",
      validatorName: "AdminCreateProduct",
      validatorFile: "packages/medusa/src/api/admin/products/validators.ts",
      passed: false,
      typeNotFound: false,
      missingFields: [],
      typeMismatchFields: [],
      extraFields: [{ fieldName: "legacy_field", actualType: "string" }],
    }
    expect(CompatibilityChecker.formatResult(result, false)).toContain(
      "legacy_field"
    )
    expect(CompatibilityChecker.formatResult(result, true)).toContain(
      "legacy_field"
    )
  })
})

// ---------------------------------------------------------------------------
// CompatibilityChecker.check — structural diffing
// ---------------------------------------------------------------------------

describe("CompatibilityChecker.check", () => {
  describe("passing cases", () => {
    it("passes when Zod type exactly matches the HTTP type", () => {
      const result = runCheck(
        `interface ZodShape { name: string; age: number }`,
        "ZodShape",
        `export interface HttpType { name: string; age: number }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
      expect(result.missingFields).toHaveLength(0)
    })

    it("passes when Zod optional fields match HTTP optional fields", () => {
      const result = runCheck(
        `interface ZodShape { name: string; description?: string }`,
        "ZodShape",
        `export interface HttpType { name: string; description?: string }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
    })
  })

  describe("extra fields", () => {
    it("fails when HTTP type has a field not present in the Zod type", () => {
      const result = runCheck(
        `interface ZodShape { name: string }`,
        "ZodShape",
        `export interface HttpType { name: string; extra?: string }`,
        "HttpType"
      )
      expect(result.passed).toBe(false)
      expect(result.extraFields.map((f) => f.fieldName)).toContain("extra")
    })

    it("reports all HTTP-only fields when there are multiple", () => {
      const result = runCheck(
        `interface ZodShape { name: string }`,
        "ZodShape",
        `export interface HttpType { name: string; fieldA: string; fieldB: number }`,
        "HttpType"
      )
      expect(result.passed).toBe(false)
      const names = result.extraFields.map((f) => f.fieldName)
      expect(names).toContain("fieldA")
      expect(names).toContain("fieldB")
    })
  })

  describe("@http-validation-ignore tag", () => {
    it("ignores extra HTTP-only fields tagged with @http-validation-ignore", () => {
      const result = runCheck(
        `interface ZodShape { name: string }`,
        "ZodShape",
        `export interface HttpType {
          name: string;
          /** @http-validation-ignore */
          extra?: string
        }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
      expect(result.extraFields).toHaveLength(0)
    })

    it("ignores type mismatches for fields tagged with @http-validation-ignore", () => {
      const result = runCheck(
        `interface ZodShape { name: string; count: number }`,
        "ZodShape",
        `export interface HttpType {
          name: string;
          /** @http-validation-ignore */
          count: string
        }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
      expect(result.typeMismatchFields).toHaveLength(0)
    })

    it("still reports fields without the tag", () => {
      const result = runCheck(
        `interface ZodShape { name: string }`,
        "ZodShape",
        `export interface HttpType {
          name: string;
          /** @http-validation-ignore */
          ignored?: string;
          extra?: string
        }`,
        "HttpType"
      )
      expect(result.passed).toBe(false)
      expect(result.extraFields.map((f) => f.fieldName)).toContain("extra")
      expect(result.extraFields.map((f) => f.fieldName)).not.toContain("ignored")
    })
  })

  describe("type not found", () => {
    it("fails with 'type not found' when the HTTP type doesn't exist", () => {
      const result = runCheck(
        `interface ZodShape { name: string }`,
        "ZodShape",
        `export interface SomethingElse { name: string }`,
        "NonExistentType"
      )
      expect(result.passed).toBe(false)
      expect(result.typeNotFound).toBe(true)
      expect(result.missingFields).toHaveLength(0)
    })
  })

  describe("missing fields", () => {
    it("reports fields present in Zod but missing from HTTP type", () => {
      const result = runCheck(
        `interface ZodShape { name: string; email: string; age: number }`,
        "ZodShape",
        `export interface HttpType { name: string }`,
        "HttpType"
      )
      expect(result.passed).toBe(false)
      const names = result.missingFields.map((f) => f.fieldName)
      expect(names).toContain("email")
      expect(names).toContain("age")
    })

    it("does not report Zod internal underscore-prefixed properties as missing", () => {
      const result = runCheck(
        `interface ZodShape { name: string; _type: string; _output: unknown }`,
        "ZodShape",
        `export interface HttpType { name: string }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
      expect(result.missingFields).toHaveLength(0)
    })

    it("does not report dollar-prefixed properties ($and, $or) as missing", () => {
      const result = runCheck(
        `interface ZodShape { name: string; $and?: unknown; $or?: unknown }`,
        "ZodShape",
        `export interface HttpType { name: string }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
    })

    it("does not report fields with 'unknown' type as missing (unresolvable Zod constructs)", () => {
      const result = runCheck(
        `interface ZodShape { name: string; preprocessed: unknown }`,
        "ZodShape",
        `export interface HttpType { name: string }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
      const names = result.missingFields.map((f) => f.fieldName)
      expect(names).not.toContain("preprocessed")
    })
  })

  describe("type mismatches", () => {
    it("reports type mismatch when field types are incompatible", () => {
      const result = runCheck(
        `interface ZodShape { count: string }`,
        "ZodShape",
        `export interface HttpType { count: number }`,
        "HttpType"
      )
      expect(result.passed).toBe(false)
      expect(result.typeMismatchFields[0]?.fieldName).toBe("count")
    })

    it("passes when Zod type is assignable to HTTP type (subtype)", () => {
      const result = runCheck(
        `interface ZodShape { status: "active" }`,
        "ZodShape",
        `export interface HttpType { status: string }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
    })
  })

  describe("lenient mode", () => {
    it("passes T|null|undefined vs T|undefined in lenient mode", () => {
      const result = runCheck(
        `interface ZodShape { name: string | null | undefined }`,
        "ZodShape",
        `export interface HttpType { name?: string }`,
        "HttpType",
        true
      )
      expect(result.passed).toBe(true)
    })

    it("still fails hard type mismatches even in lenient mode", () => {
      const result = runCheck(
        `interface ZodShape { count: string | null | undefined }`,
        "ZodShape",
        `export interface HttpType { count?: number }`,
        "HttpType",
        true
      )
      expect(result.passed).toBe(false)
    })
  })

  describe("string enum compatibility", () => {
    it("passes when Zod has plain string and HTTP has a string literal union", () => {
      const result = runCheck(
        `interface ZodShape { status: string }`,
        "ZodShape",
        `export interface HttpType { status: "active" | "inactive" }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
    })

    it("passes when Zod has string literal union and HTTP has plain string", () => {
      const result = runCheck(
        `interface ZodShape { status: "active" | "inactive" }`,
        "ZodShape",
        `export interface HttpType { status: string }`,
        "HttpType"
      )
      expect(result.passed).toBe(true)
    })

    it("fails when Zod has values not present in the HTTP enum", () => {
      const result = runCheck(
        `interface ZodShape { status: "a" | "b" | "c" }`,
        "ZodShape",
        `export interface HttpType { status: "a" | "b" }`,
        "HttpType"
      )
      expect(result.passed).toBe(false)
    })
  })

  describe("OperatorMap compatibility", () => {
    it("passes when both sides have OperatorMap shape ($eq property)", () => {
      const zodSource = `
        interface OperatorMapLike { $eq?: string; $ne?: string; $in?: string[]; $nin?: string[]; $gt?: string; $gte?: string; $lt?: string; $lte?: string }
        interface ZodShape { id: string | OperatorMapLike }
      `
      const httpSource = `
        interface OperatorMapLike { $eq?: string; $ne?: string; $in?: string[]; $nin?: string[]; $gt?: string; $gte?: string; $lt?: string; $lte?: string; $fulltext?: string }
        export interface HttpType { id: string | OperatorMapLike }
      `
      const result = runCheck(zodSource, "ZodShape", httpSource, "HttpType")
      expect(result.passed).toBe(true)
    })
  })
})
