import { TypeEmitter } from "../core/type-emitter"
import { ImportTracker } from "../core/import-tracker"
import type { ResolvedSchemaType } from "../core/type-resolver"
import { createSingleFileProgram } from "./utils/ts-utils"
import ts from "typescript"

function makeResolved(
  type: ts.Type,
  opts: Partial<Omit<ResolvedSchemaType, "type">> = {}
): ResolvedSchemaType {
  return {
    type,
    hasFindParams: false,
    hasSelectParams: false,
    hasBaseFilterable: false,
    schemaName: "TestType",
    ...opts,
  }
}

// ---------------------------------------------------------------------------
// TypeEmitter.emitInterface
// ---------------------------------------------------------------------------

describe("TypeEmitter.emitInterface", () => {
  describe("basic field emission", () => {
    it("emits required fields with their types", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape { name: string; age: number }`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      const output = emitter.emitInterface(
        "AdminCreate",
        makeResolved(getType("Shape")),
        tracker
      )

      expect(output).toContain("export interface AdminCreate")
      expect(output).toContain("name: string")
      expect(output).toContain("age: number")
    })

    it("emits optional fields with the question-mark token", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape { name: string; description?: string }`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      const output = emitter.emitInterface(
        "AdminCreate",
        makeResolved(getType("Shape")),
        tracker
      )

      expect(output).toContain("description?: string")
    })

    it("emits nullable fields as T | null", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape { title: string | null }`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      const output = emitter.emitInterface(
        "AdminCreate",
        makeResolved(getType("Shape")),
        tracker
      )

      expect(output).toContain("title: string | null")
    })

    it("emits array fields", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape { tags: string[] }`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      const output = emitter.emitInterface(
        "AdminCreate",
        makeResolved(getType("Shape")),
        tracker
      )

      expect(output).toContain("tags: string[]")
    })

    it("emits an empty interface when the type has no properties", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape {}`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      const output = emitter.emitInterface(
        "AdminCreate",
        makeResolved(getType("Shape")),
        tracker
      )

      expect(output).toContain("export interface AdminCreate")
      expect(output).not.toContain(":")
    })
  })

  describe("extends clauses", () => {
    it("adds 'extends FindParams' when hasFindParams is true", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape { q?: string }`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      const output = emitter.emitInterface(
        "AdminListParams",
        makeResolved(getType("Shape"), { hasFindParams: true }),
        tracker
      )

      expect(output).toContain("extends FindParams")
      expect(tracker.needsFindParams).toBe(true)
    })

    it("adds 'extends BaseFilterable<T>' when hasBaseFilterable is true", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape { q?: string }`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      const output = emitter.emitInterface(
        "AdminFilters",
        makeResolved(getType("Shape"), { hasBaseFilterable: true }),
        tracker
      )

      expect(output).toContain("extends BaseFilterable<AdminFilters>")
      expect(tracker.needsBaseFilterable).toBe(true)
    })

    it("adds both 'extends FindParams, BaseFilterable<T>' when both flags are true", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape { q?: string }`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      const output = emitter.emitInterface(
        "AdminListFilters",
        makeResolved(getType("Shape"), {
          hasFindParams: true,
          hasBaseFilterable: true,
        }),
        tracker
      )

      expect(output).toContain("FindParams")
      expect(output).toContain("BaseFilterable<AdminListFilters>")
    })
  })

  describe("import tracker", () => {
    it("does not set any tracker flags for a plain interface", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape { name: string }`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      emitter.emitInterface(
        "AdminCreate",
        makeResolved(getType("Shape")),
        tracker
      )

      expect(tracker.needsFindParams).toBe(false)
      expect(tracker.needsBaseFilterable).toBe(false)
      expect(tracker.needsOperatorMap).toBe(false)
    })

    it("sets needsFindParams when hasFindParams is true", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape {}`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      emitter.emitInterface(
        "T",
        makeResolved(getType("Shape"), { hasFindParams: true }),
        tracker
      )

      expect(tracker.needsFindParams).toBe(true)
    })

    it("sets needsBaseFilterable when hasBaseFilterable is true", () => {
      const { checker, getType } = createSingleFileProgram(
        `interface Shape {}`
      )
      const emitter = new TypeEmitter(checker)
      const tracker = new ImportTracker()
      emitter.emitInterface(
        "T",
        makeResolved(getType("Shape"), { hasBaseFilterable: true }),
        tracker
      )

      expect(tracker.needsBaseFilterable).toBe(true)
    })
  })
})

// ---------------------------------------------------------------------------
// TypeEmitter.assembleFile
// ---------------------------------------------------------------------------

describe("TypeEmitter.assembleFile", () => {
  const outputFile =
    "/repo/packages/core/types/src/http/product/admin/payloads.ts"

  it("joins multiple interfaces separated by blank lines", () => {
    const interfaces = [
      { name: "A", code: "export interface A { x: string }" },
      { name: "B", code: "export interface B { y: number }" },
    ]
    const content = TypeEmitter.assembleFile(
      interfaces,
      new ImportTracker(),
      outputFile
    )

    expect(content).toContain("export interface A")
    expect(content).toContain("export interface B")
  })

  it("includes a FindParams import when needsFindParams is true", () => {
    const tracker = new ImportTracker()
    tracker.needsFindParams = true

    const content = TypeEmitter.assembleFile(
      [{ name: "T", code: "export interface T {}" }],
      tracker,
      outputFile
    )

    expect(content).toMatch(/import \{ FindParams \} from ".*"/)
  })

  it("includes SelectParams in the common import when needsSelectParams is true", () => {
    const tracker = new ImportTracker()
    tracker.needsSelectParams = true

    const content = TypeEmitter.assembleFile(
      [{ name: "T", code: "export interface T {}" }],
      tracker,
      outputFile
    )

    expect(content).toMatch(/import \{ SelectParams \} from ".*"/)
  })

  it("combines FindParams and SelectParams into a single common import", () => {
    const tracker = new ImportTracker()
    tracker.needsFindParams = true
    tracker.needsSelectParams = true

    const content = TypeEmitter.assembleFile(
      [{ name: "T", code: "export interface T {}" }],
      tracker,
      outputFile
    )

    const importLines = content.split("\n").filter((l) => l.startsWith("import"))
    expect(importLines).toHaveLength(1)
    expect(importLines[0]).toContain("FindParams")
    expect(importLines[0]).toContain("SelectParams")
  })

  it("includes a DAL import with BaseFilterable when needsBaseFilterable is true", () => {
    const tracker = new ImportTracker()
    tracker.needsBaseFilterable = true

    const content = TypeEmitter.assembleFile(
      [{ name: "T", code: "export interface T {}" }],
      tracker,
      outputFile
    )

    expect(content).toMatch(/import \{ BaseFilterable \} from ".*"/)
  })

  it("combines BaseFilterable and OperatorMap into a single DAL import", () => {
    const tracker = new ImportTracker()
    tracker.needsBaseFilterable = true
    tracker.needsOperatorMap = true

    const content = TypeEmitter.assembleFile(
      [{ name: "T", code: "export interface T {}" }],
      tracker,
      outputFile
    )

    const importLines = content.split("\n").filter((l) => l.startsWith("import"))
    const dalImport = importLines.find((l) => l.includes("BaseFilterable"))
    expect(dalImport).toBeDefined()
    expect(dalImport).toContain("OperatorMap")
    expect(importLines).toHaveLength(1)
  })

  it("produces no import lines when no imports are needed", () => {
    const content = TypeEmitter.assembleFile(
      [{ name: "T", code: "export interface T { x: string }" }],
      new ImportTracker(),
      outputFile
    )

    expect(
      content.split("\n").filter((l) => l.startsWith("import"))
    ).toHaveLength(0)
  })
})
