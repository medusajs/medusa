import ts from "typescript"
import { TsHelpers } from "../utils/ts-helpers"
import { createSingleFileProgram } from "./utils/ts-utils"

/**
 * Resolves the type of a top-level `export const NAME` declaration.
 */
function getConstType(checker: ts.TypeChecker, source: ts.SourceFile, name: string): ts.Type {
  let result: ts.Type | undefined
  ts.forEachChild(source, (node) => {
    if (result) return
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === name) {
          const sym = checker.getSymbolAtLocation(decl.name)
          if (sym) result = checker.getTypeOfSymbolAtLocation(sym, decl)
        }
      }
    }
  })
  if (!result) throw new Error(`const '${name}' not found`)
  return result
}

describe("TsHelpers.isOperatorMapZodSchema", () => {
  // Minimal Zod-shaped declarations: only the structural shape the resolver
  // inspects (class name + first type argument) needs to be present.
  const ZOD_DECLS = `
    declare class ZodString { _zod: any }
    declare class ZodArray<T> { _zod: any }
    declare class ZodUnion<T> { _zod: any }
    declare class ZodOptional<T> { _zod: any }
    declare class ZodObject<Shape> { _zod: any }
  `

  function setup(source: string) {
    const { program, checker } = createSingleFileProgram(source)
    return { checker, source: program.getSourceFile("input.ts")! }
  }

  it("detects createOperatorMap-style schemas wrapped in ZodOptional", () => {
    const { checker, source } = setup(`
      ${ZOD_DECLS}
      type SimpleType = ZodOptional<ZodUnion<readonly [
        ZodOptional<ZodString>,
        ZodOptional<ZodArray<ZodString>>
      ]>>
      type ArrayType = ZodOptional<ZodArray<ZodString>>
      type OperatorMapInner = ZodUnion<readonly [
        SimpleType,
        ZodObject<{
          $eq: SimpleType
          $ne: SimpleType
          $in: ArrayType
          $nin: ArrayType
          $like: SimpleType
          $ilike: SimpleType
          $gt: SimpleType
          $gte: SimpleType
          $lt: SimpleType
          $lte: SimpleType
        }>
      ]>
      export declare const operatorMap: ZodOptional<OperatorMapInner>
    `)
    const type = getConstType(checker, source, "operatorMap")
    expect(TsHelpers.isOperatorMapZodSchema(checker, type)).toBe(true)
  })

  it("returns false for a plain ZodOptional<ZodString>", () => {
    const { checker, source } = setup(`
      ${ZOD_DECLS}
      export declare const plain: ZodOptional<ZodString>
    `)
    const type = getConstType(checker, source, "plain")
    expect(TsHelpers.isOperatorMapZodSchema(checker, type)).toBe(false)
  })

  it("returns false for a ZodObject whose shape does not contain operator keys", () => {
    const { checker, source } = setup(`
      ${ZOD_DECLS}
      export declare const obj: ZodOptional<ZodObject<{
        title: ZodOptional<ZodString>
        handle: ZodOptional<ZodString>
      }>>
    `)
    const type = getConstType(checker, source, "obj")
    expect(TsHelpers.isOperatorMapZodSchema(checker, type)).toBe(false)
  })
})
