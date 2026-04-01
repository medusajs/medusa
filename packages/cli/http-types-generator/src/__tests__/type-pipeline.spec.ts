/**
 * End-to-end pipeline tests: simulated Zod schema source → emitted HTTP interface string.
 *
 * These tests exercise the full conversion path:
 *   SchemaExtractor.extract → TypeResolver.resolveSchemaType → TypeEmitter.emitInterface
 *
 * Rather than depending on the real Zod runtime, the source strings use
 * plain TypeScript declarations that carry the same structural shape the TS
 * compiler sees when resolving real Zod generics: an object type with
 * `_input` and `_output` properties whose types are the inferred shapes.
 */
import { SchemaExtractor } from "../core/schema-extractor"
import { TypeResolver } from "../core/type-resolver"
import { TypeEmitter } from "../core/type-emitter"
import { ImportTracker } from "../core/import-tracker"
import { createTestProgram } from "./utils/ts-utils"

// ---------------------------------------------------------------------------
// Pipeline runner
// ---------------------------------------------------------------------------

interface PipelineResult {
  name: string
  code: string
  tracker: ImportTracker
}

/**
 * Runs the full schema → HTTP type pipeline against an in-memory TypeScript
 * source file and returns the emitted interface for each extracted schema.
 */
function runPipeline(source: string): PipelineResult[] {
  const fileName = "validators.ts"
  const { program, checker } = createTestProgram({ [fileName]: source })
  const sourceFile = program.getSourceFile(fileName)!

  const extractor = new SchemaExtractor(checker)
  const resolver = new TypeResolver(checker)
  const emitter = new TypeEmitter(checker)

  const schemas = extractor.extract(sourceFile)
  const results: PipelineResult[] = []

  for (const schema of schemas) {
    const resolved = resolver.resolveSchemaType(schema)
    if (!resolved) continue
    const tracker = new ImportTracker()
    const code = emitter.emitInterface(schema.httpTypeName, resolved, tracker)
    results.push({ name: schema.httpTypeName, code, tracker })
  }

  return results
}

// ---------------------------------------------------------------------------
// Plain object schemas
// ---------------------------------------------------------------------------

describe("plain object schemas", () => {
  it("emits required fields with their types", () => {
    const [result] = runPipeline(`
      export declare const AdminCreateProduct: {
        _input: { title: string; handle: string }
        _output: { title: string; handle: string }
      }
    `)
    expect(result.code).toContain("export interface AdminCreateProduct")
    expect(result.code).toContain("title: string")
    expect(result.code).toContain("handle: string")
  })

  it("emits optional fields with the question-mark token", () => {
    const [result] = runPipeline(`
      export declare const AdminCreateProduct: {
        _input: { title: string; description?: string }
        _output: { title: string; description?: string }
      }
    `)
    expect(result.code).toContain("title: string")
    expect(result.code).toContain("description?: string")
  })

  it("emits nullable fields as T | null", () => {
    const [result] = runPipeline(`
      export declare const AdminCreateProduct: {
        _input: { title: string | null }
        _output: { title: string | null }
      }
    `)
    expect(result.code).toContain("title: string | null")
  })

  it("emits array fields", () => {
    const [result] = runPipeline(`
      export declare const AdminCreateProduct: {
        _input: { tags: string[] }
        _output: { tags: string[] }
      }
    `)
    expect(result.code).toContain("tags: string[]")
  })

  it("skips schemas without Admin or Store prefix", () => {
    const results = runPipeline(`
      export declare const CreateProduct: {
        _input: { title: string }
        _output: { title: string }
      }
    `)
    expect(results).toHaveLength(0)
  })

  it("extracts multiple schemas from the same file", () => {
    const results = runPipeline(`
      export declare const AdminCreateProduct: {
        _input: { title: string }
        _output: { title: string }
      }
      export declare const AdminUpdateProduct: {
        _input: { title?: string }
        _output: { title?: string }
      }
    `)
    expect(results).toHaveLength(2)
    const names = results.map((r) => r.name)
    expect(names).toContain("AdminCreateProduct")
    expect(names).toContain("AdminUpdateProduct")
  })
})

// ---------------------------------------------------------------------------
// createFindParams schemas
// ---------------------------------------------------------------------------

describe("createFindParams schemas", () => {
  const FIND_PARAMS_SOURCE = `
    declare function createFindParams(): {
      _input: { limit?: number; offset?: number; fields?: string; order?: string; with_deleted?: boolean }
      _output: { limit?: number; offset?: number; fields?: string; order?: string; with_deleted?: boolean }
    }
  `

  it("emits 'extends FindParams' when the chain includes createFindParams()", () => {
    const [result] = runPipeline(`
      ${FIND_PARAMS_SOURCE}
      export const AdminGetProductsParams = createFindParams()
    `)
    expect(result.code).toContain("extends FindParams")
    expect(result.tracker.needsFindParams).toBe(true)
  })

  it("omits FindParams fields (limit, offset, etc.) from the inline body", () => {
    const [result] = runPipeline(`
      ${FIND_PARAMS_SOURCE}
      export const AdminGetProductsParams = createFindParams()
    `)
    expect(result.code).not.toContain("limit")
    expect(result.code).not.toContain("offset")
    expect(result.code).not.toContain("fields")
    expect(result.code).not.toContain("order")
    expect(result.code).not.toContain("with_deleted")
  })

  it("includes extra fields beyond the FindParams base", () => {
    const [result] = runPipeline(`
      declare function createFindParams(): {
        _input: { limit?: number; offset?: number; fields?: string; order?: string; with_deleted?: boolean; q?: string }
        _output: { limit?: number; offset?: number; fields?: string; order?: string; with_deleted?: boolean; q?: string }
      }
      export const AdminGetProductsParams = createFindParams()
    `)
    expect(result.code).toContain("extends FindParams")
    expect(result.code).toContain("q?: string")
  })
})

// ---------------------------------------------------------------------------
// createSelectParams schemas
// ---------------------------------------------------------------------------

describe("createSelectParams schemas", () => {
  const SELECT_PARAMS_SOURCE = `
    declare function createSelectParams(): {
      _input: { fields?: string }
      _output: { fields?: string }
    }
  `

  it("emits 'extends SelectParams' when the chain includes createSelectParams()", () => {
    const [result] = runPipeline(`
      ${SELECT_PARAMS_SOURCE}
      export const AdminGetProductParams = createSelectParams()
    `)
    expect(result.code).toContain("extends SelectParams")
    expect(result.tracker.needsSelectParams).toBe(true)
  })

  it("omits the 'fields' property from the inline body", () => {
    const [result] = runPipeline(`
      ${SELECT_PARAMS_SOURCE}
      export const AdminGetProductParams = createSelectParams()
    `)
    expect(result.code).not.toContain("fields")
  })

  it("includes extra fields beyond SelectParams", () => {
    const [result] = runPipeline(`
      declare function createSelectParams(): {
        _input: { fields?: string; expand?: string }
        _output: { fields?: string; expand?: string }
      }
      export const AdminGetProductParams = createSelectParams()
    `)
    expect(result.code).toContain("extends SelectParams")
    expect(result.code).toContain("expand?: string")
    expect(result.code).not.toContain("fields")
  })

  it("does NOT emit SelectParams when createFindParams is also in the chain", () => {
    const [result] = runPipeline(`
      declare function createFindParams(): {
        _input: { limit?: number; offset?: number; fields?: string; order?: string; with_deleted?: boolean }
        _output: { limit?: number; offset?: number; fields?: string; order?: string; with_deleted?: boolean }
      }
      export const AdminGetProductsParams = createFindParams()
    `)
    expect(result.code).toContain("extends FindParams")
    expect(result.code).not.toContain("SelectParams")
    expect(result.tracker.needsSelectParams).toBe(false)
    expect(result.tracker.needsFindParams).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// WithAdditionalData schemas
// ---------------------------------------------------------------------------

describe("WithAdditionalData schemas", () => {
  it("resolves the inner schema type, excluding additional_data", () => {
    const [result] = runPipeline(`
      declare function WithAdditionalData<T>(schema: T): () => void
      const CreateProduct: {
        _input: { title: string; description?: string }
        _output: { title: string; description?: string }
      }
      export const AdminCreateProduct = WithAdditionalData(CreateProduct)
    `)
    expect(result.code).toContain("export interface AdminCreateProduct")
    expect(result.code).toContain("title: string")
    expect(result.code).toContain("description?: string")
    expect(result.code).not.toContain("additional_data")
  })
})

// ---------------------------------------------------------------------------
// Transform schemas (ZodEffects)
// ---------------------------------------------------------------------------

describe("ZodEffects (transform) schemas", () => {
  it("uses _input type rather than _output type for transforms", () => {
    const [result] = runPipeline(`
      interface ZodEffects<O, I> { _output: O; _input: I }
      export declare const AdminCreateOrder: ZodEffects<
        { id: string },
        { raw_title: string; quantity: number }
      >
    `)
    expect(result.code).toContain("raw_title: string")
    expect(result.code).toContain("quantity: number")
    expect(result.code).not.toContain("id: string")
  })
})
