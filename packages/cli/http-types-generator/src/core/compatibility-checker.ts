import ts from "typescript"
import path from "path"
import { fromRoot } from "../utils/fs-helpers"
import {
  typeToDisplayString,
  isPlainString,
  isStringLiteralOrUnion,
  isStringEnumType,
  getStringLiteralValues,
} from "../utils/ts-helpers"
import { FIND_PARAMS_FIELDS, SELECT_PARAMS_FIELDS } from "./type-resolver"

export interface CompatibilityResult {
  httpTypeName: string
  httpTypeFile: string
  validatorName: string
  /** Absolute path to the validator file that contains the Zod schema */
  validatorFile: string
  passed: boolean
  /** True when the HTTP type interface was not found in the target file at all. */
  typeNotFound: boolean
  missingFields: FieldDiff[]
  typeMismatchFields: FieldDiff[]
  extraFields: FieldDiff[]
}

export interface FieldDiff {
  fieldName: string
  expectedType?: string
  actualType?: string
}

export interface CheckPair {
  /** The Zod schema export name (for diagnostics) */
  validatorName: string
  /** Absolute path to the validator file that contains the Zod schema */
  validatorFile: string
  /** The HTTP type name to check against */
  httpTypeName: string
  /** The resolved TypeScript type from the Zod schema (_input or _output) */
  resolvedZodType: ts.Type
  /** Absolute path to the HTTP type file */
  httpTypeFile: string
  /**
   * Whether the Zod schema uses createFindParams(). When true, FindParams
   * fields (limit, offset, fields, order, with_deleted) are expected to be
   * present in the HTTP type via `extends FindParams` and must not be flagged
   * as HTTP-only even if they're absent from the resolved Zod type (which can
   * happen when applyAndAndOrOperators forces a baseFieldsType fallback).
   */
  hasFindParams: boolean
  /** Whether the Zod schema uses createSelectParams() (but not createFindParams). */
  hasSelectParams: boolean
}

export interface CheckCompatibilityOptions {
  program: ts.Program
  checker: ts.TypeChecker
  pairs: CheckPair[]
  httpTypeFiles: string[]
  lenient?: boolean
}

/**
 * Checks structural compatibility between Zod-inferred types and existing HTTP types
 * by performing field-level structural diffs.
 *
 * For each pair, compares the properties of the resolved Zod type against the
 * corresponding HTTP interface and reports missing fields and type mismatches.
 *
 * @param lenient - When true, treats `T | null | undefined` as compatible with
 *   `T | undefined` (ignores the presence of `null` in the Zod schema type).
 *   Useful for legacy HTTP types that omit `null` from nullable fields.
 */
export function checkCompatibility({
  program,
  checker,
  pairs,
  httpTypeFiles,
  lenient = false,
}: CheckCompatibilityOptions): CompatibilityResult[] {
  const httpTypeMap = buildHttpTypeMap(program, checker, httpTypeFiles)
  return pairs.map((pair) => checkSinglePair({ checker, pair, httpTypeMap, lenient }))
}

/**
 * Checks string/enum compatibility between a Zod type and an HTTP type:
 *
 * - Zod `string` vs HTTP string enum → compatible (the enum is a refinement
 *   for type completion; the validator accepts any string).
 * - Zod string enum vs HTTP string enum → compatible only if the value sets
 *   are identical.
 * - Zod string enum vs HTTP `string` → compatible (enum is more specific).
 *
 * Null/undefined is stripped from both sides before the check.
 */
function isStringEnumCompatible(
  checker: ts.TypeChecker,
  zodType: ts.Type,
  httpType: ts.Type
): boolean {
  const zodBase = checker.getNonNullableType(zodType)
  const httpBase = checker.getNonNullableType(httpType)

  const zodIsString = isPlainString(zodBase)
  const zodIsEnum = isStringLiteralOrUnion(zodBase)
  const httpIsString = isPlainString(httpBase)
  const httpIsEnum = isStringLiteralOrUnion(httpBase)

  const httpIsStringEnum = isStringEnumType(httpBase)

  // Zod string → HTTP string literal enum or TS string enum: always compatible
  if (zodIsString && (httpIsEnum || httpIsStringEnum)) {
    return true
  }

  // Zod enum → HTTP string: always compatible
  if (zodIsEnum && httpIsString) {
    return true
  }

  // Zod enum → HTTP enum: compatible only when value sets match
  if (zodIsEnum && httpIsEnum) {
    const zodValues = getStringLiteralValues(zodBase)
    const httpValues = getStringLiteralValues(httpBase)
    if (zodValues.size !== httpValues.size) {
      return false
    }
    for (const v of zodValues) {
      if (!httpValues.has(v)) {
        return false
      }
    }
    return true
  }

  // Handle T | T[] vs Enum | Enum[] patterns (e.g. string | string[] vs OrderStatus | OrderStatus[]).
  // This occurs when Zod uses a generic string union while HTTP uses a typed enum union, and
  // the same "scalar | array-of-scalar" structure appears on both sides.
  if (zodBase.isUnion() && httpBase.isUnion()) {
    const zodScalars = zodBase.types.filter((t) => !checker.isArrayType(t))
    const httpScalars = httpBase.types.filter((t) => !checker.isArrayType(t))

    // Both sides must have scalar members
    if (zodScalars.length > 0 && httpScalars.length > 0) {
      // Check that ALL Zod scalar members are plain strings
      const zodScalarsAreStrings = zodScalars.every(isPlainString)
      // Check that ALL HTTP scalar members are string-based (literal, TS enum, or plain string)
      const httpScalarsAreStringBased = httpScalars.every(
        (t) => isPlainString(t) || isStringLiteralOrUnion(t) || isStringEnumType(t)
      )

      if (zodScalarsAreStrings && httpScalarsAreStringBased) {
        return true
      }
    }
  }

  return false
}

/**
 * Returns true if a type (or one of its union members) has an `$eq` property,
 * indicating it is OperatorMap-shaped (the Zod createOperatorMap result or the
 * HTTP OperatorMap<T> interface).
 */
function hasOperatorMapShape(type: ts.Type): boolean {
  if (type.getProperty("$eq")) {
    return true
  }
  if (type.isUnion()) {
    return type.types.some((t) => t.getProperty("$eq") !== undefined)
  }
  return false
}


/**
 * Checks OperatorMap compatibility between a Zod type and an HTTP type.
 *
 * Compatible only when both sides are OperatorMap-shaped (have `$eq` property):
 * the Zod `createOperatorMap()` result vs the HTTP `OperatorMap<T>` interface.
 * The HTTP interface is wider (includes `$fulltext`, `$overlap`, etc.) but both
 * represent the same filter contract.
 *
 * A Zod scalar (`string | string[]`) against an HTTP `OperatorMap` is NOT
 * considered compatible — the HTTP type would mislead callers into thinking
 * they can pass operator objects like `{ $eq: "foo" }` when the validator
 * only accepts plain strings.
 */
function isOperatorMapCompatible(
  checker: ts.TypeChecker,
  zodType: ts.Type,
  httpType: ts.Type
): boolean {
  const zodNonNull = checker.getNonNullableType(zodType)
  const httpNonNull = checker.getNonNullableType(httpType)
  return hasOperatorMapShape(zodNonNull) && hasOperatorMapShape(httpNonNull)
}

/**
 * Recursively checks whether `zodType` is compatible with `httpType` in lenient
 * mode, stripping `null | undefined` at each level before comparing.
 *
 * This handles the common pattern where the HTTP type uses a named reference
 * (e.g. `AdminUpsertStockLocationAddress`) while the Zod type is an equivalent
 * inline object whose nested fields carry `| null | undefined`.
 *
 * The recursion is bounded by `depth` to prevent runaway on circular types.
 */
function isLenientlyCompatible(
  checker: ts.TypeChecker,
  zodType: ts.Type,
  httpType: ts.Type,
  depth = 0
): boolean {
  // Direct assignability — no further work needed
  if (checker.isTypeAssignableTo(zodType, httpType)) {
    return true
  }

  // Strip null/undefined from both sides and retry
  const zodNonNull = checker.getNonNullableType(zodType)
  const httpNonNull = checker.getNonNullableType(httpType)

  if (checker.isTypeAssignableTo(zodNonNull, httpNonNull)) {
    return true
  }

  // If we've reached the depth limit, don't recurse further
  if (depth >= 8) {
    return false
  }

  // Query-param array coercion: Zod often accepts `T | T[]` (a single value or
  // an array of values) while HTTP types use `T[]`. Treat these as compatible in
  // lenient mode since the single-string form gets coerced to an array.
  if (zodNonNull.isUnion() && checker.isArrayType(httpNonNull)) {
    const httpElemTypes = checker.getTypeArguments(httpNonNull as ts.TypeReference)
    if (httpElemTypes.length === 1) {
      const httpElemType = httpElemTypes[0]
      // Check if Zod union is a mix of `T` and `T[]` (or string + string[])
      const zodArrayMember = zodNonNull.types.find((t) =>
        checker.isArrayType(t)
      )
      const zodScalarMember = zodNonNull.types.find(
        (t) => !checker.isArrayType(t)
      )
      if (zodArrayMember && zodScalarMember) {
        const zodArrayElem = checker.getTypeArguments(
          zodArrayMember as ts.TypeReference
        )[0]
        if (
          zodArrayElem &&
          checker.isTypeAssignableTo(zodArrayElem, httpElemType) &&
          checker.isTypeAssignableTo(zodScalarMember, httpElemType)
        ) {
          return true
        }
      }
    }
  }

  // If both non-nullable types are Record-like (index signature with no named
  // properties), treat them as compatible. Zod commonly uses Record<string, unknown>
  // while HTTP types use Record<string, string> for the same metadata-style fields.
  const zodIndexInfos = checker.getIndexInfosOfType(zodNonNull)
  const httpIndexInfos = checker.getIndexInfosOfType(httpNonNull)
  if (zodIndexInfos.length > 0 && zodNonNull.getProperties().length === 0) {
    if (
      // Both are Record-like → compatible
      (httpIndexInfos.length > 0 && httpNonNull.getProperties().length === 0) ||
      // Zod is Record, HTTP is a specific named-property object → compatible.
      // Record<string, T> is structurally a superset of any named-property interface;
      // the Zod validator is intentionally more permissive than the HTTP type hint.
      (!checker.isArrayType(httpNonNull) &&
        httpNonNull.getProperties().length > 0)
    ) {
      return true
    }
  }

  // If both non-nullable types are arrays, compare their element types
  if (checker.isArrayType(zodNonNull) && checker.isArrayType(httpNonNull)) {
    const zodElem = checker.getTypeArguments(zodNonNull as ts.TypeReference)[0]
    const httpElem = checker.getTypeArguments(httpNonNull as ts.TypeReference)[0]
    if (zodElem && httpElem) {
      return isLenientlyCompatible(checker, zodElem, httpElem, depth + 1)
    }
    return false
  }

  // If both non-nullable types are object-shaped, compare their properties
  // recursively so that nested `| null | undefined` differences are tolerated.
  const zodProps = zodNonNull.getProperties()
  const httpProps = httpNonNull.getProperties()

  if (zodProps.length === 0 || httpProps.length === 0) {
    return false
  }

  const httpPropMap = new Map<string, ts.Symbol>()
  for (const p of httpProps) {
    httpPropMap.set(p.name, p)
  }

  for (const zodProp of zodProps) {
    if (isInternalPropertyName(zodProp.name)) {
      continue
    }
    const httpProp = httpPropMap.get(zodProp.name)
    if (!httpProp) {
      return false
    }
    const zodPropType = checker.getTypeOfSymbol(zodProp)
    const httpPropType = checker.getTypeOfSymbol(httpProp)

    // Skip any/unknown Zod types — unresolvable, trust the HTTP type
    if (
      zodPropType.flags & ts.TypeFlags.Unknown ||
      zodPropType.flags & ts.TypeFlags.Any
    ) {
      continue
    }

    if (!isLenientlyCompatible(checker, zodPropType, httpPropType, depth + 1)) {
      return false
    }
  }

  return true
}

/**
 * Returns true if a property name should be skipped during structural diffing.
 * Covers Zod internal prefixes (`_`, `$`, `~`) and known Zod method names that
 * leak into resolved types when TS resolves to the Zod class type.
 */
function isInternalPropertyName(name: string): boolean {
  return (
    name.startsWith("_") ||
    name.startsWith("$") ||
    name.startsWith("~") ||
    ZOD_INTERNAL_NAMES.has(name)
  )
}

/**
 * Zod schema method and internal property names that may leak into resolved TypeScript types
 * when the TypeScript compiler can't fully resolve a complex merged Zod schema.
 *
 * These are not actual domain fields — they are Zod's own API surface that gets exposed
 * when TypeScript returns the Zod class type instead of the inferred output type.
 */
const ZOD_INTERNAL_NAMES = new Set([
  // Zod schema methods
  "parse",
  "parseAsync",
  "safeParse",
  "safeParseAsync",
  "refine",
  "superRefine",
  "transform",
  "default",
  "describe",
  "optional",
  "nullable",
  "array",
  "or",
  "and",
  "brand",
  "pipe",
  "readonly",
  "catch",
  "preprocess",
  // ZodObject-specific methods
  "merge",
  "augment",
  "extend",
  "pick",
  "omit",
  "partial",
  "required",
  "deepPartial",
  "keyof",
  "strip",
  "strict",
  "passthrough",
  "setKey",
  "nonstrict",
  // Zod internal fields
  "shape",
  "spa",
  "description",
  // Zod schema predicate methods (return boolean, not a Zod type)
  "isOptional",
  "isNullable",
])

interface DiffTypesOptions {
  checker: ts.TypeChecker
  zodType: ts.Type
  httpType: ts.Type
  lenient?: boolean
  hasFindParams?: boolean
  hasSelectParams?: boolean
}

/**
 * Performs a field-level structural diff between two TypeScript types.
 * This is used to generate human-readable error messages.
 *
 * Checks:
 * - Fields present in zodType but missing from httpType (missingFields)
 * - Fields present in httpType but missing from zodType (extraFields — also errors)
 * - Fields present in both but with incompatible types (typeMismatchFields)
 *
 * @param lenient - When true, a `T | null | undefined` Zod type is considered
 *   compatible with `T | undefined` by comparing non-nullable base types.
 */
function diffTypes({ checker, zodType, httpType, lenient = false, hasFindParams = false, hasSelectParams = false }: DiffTypesOptions): {
  missingFields: FieldDiff[]
  typeMismatchFields: FieldDiff[]
  extraFields: FieldDiff[]
} {
  const missingFields: FieldDiff[] = []
  const typeMismatchFields: FieldDiff[] = []
  const extraFields: FieldDiff[] = []

  // Build maps of property name → type for each side
  const zodProps = new Map<string, ts.Symbol>()
  const httpProps = new Map<string, ts.Symbol>()

  for (const prop of zodType.getProperties()) {
    zodProps.set(prop.name, prop)
  }
  for (const prop of httpType.getProperties()) {
    httpProps.set(prop.name, prop)
  }

  for (const [name, zodProp] of zodProps) {
    if (isInternalPropertyName(name)) {
      continue
    }

    const zodPropType = checker.getTypeOfSymbol(zodProp)

    // Skip properties whose type is itself a Zod schema type (has _output or _input),
    // indicating a Zod schema leaked through into the resolved TypeScript type.
    if (
      zodPropType.getProperty("_output") !== undefined ||
      zodPropType.getProperty("_input") !== undefined
    ) {
      continue
    }

    // Skip Zod schema method types that leak through (e.g. `strict`, `strip`,
    // `partial`, `merge`, etc.). These are detected as callable types whose return
    // type is a Zod schema (has _output/_input).
    const callSigs = zodPropType.getCallSignatures()
    if (callSigs.length > 0) {
      const retType = checker.getReturnTypeOfSignature(callSigs[0])
      if (
        retType.getProperty("_output") !== undefined ||
        retType.getProperty("_input") !== undefined
      ) {
        continue
      }
    }

    const httpProp = httpProps.get(name)

    if (!httpProp) {
      // Field is in Zod schema but missing from HTTP type.
      // Skip fields whose type resolved to `any` or `unknown` — these come
      // from unresolvable Zod constructs (z.preprocess, createOperatorMap with
      // valueParser) and cannot be meaningfully verified.
      if (
        zodPropType.flags & ts.TypeFlags.Unknown ||
        zodPropType.flags & ts.TypeFlags.Any
      ) {
        continue
      }
      missingFields.push({
        fieldName: name,
        expectedType: typeToDisplayString(checker, zodPropType),
      })
      continue
    }

    // Both have the field — check type compatibility
    const httpPropType = checker.getTypeOfSymbol(httpProp)

    // If the Zod field type resolved to `unknown` or `any` (e.g. from
    // z.preprocess() or createOperatorMap() with a valueParser), we cannot
    // verify compatibility — trust the HTTP type and skip the check.
    if (
      zodPropType.flags & ts.TypeFlags.Unknown ||
      zodPropType.flags & ts.TypeFlags.Any
    ) {
      continue
    }

    // Check if zodPropType is assignable to httpPropType
    let isAssignable = checker.isTypeAssignableTo(zodPropType, httpPropType)

    // Lenient mode: if not directly assignable, apply a recursive lenient
    // comparison that strips null/undefined at each level. This handles cases
    // where the HTTP type uses a named reference (e.g. AdminUpsertAddress) while
    // the Zod type is an equivalent inline object with | null | undefined on fields.
    if (!isAssignable && lenient) {
      isAssignable = isLenientlyCompatible(checker, zodPropType, httpPropType)
    }

    // OperatorMap compatibility: always applied regardless of lenient mode.
    // createOperatorMap() produces a narrower Zod union than the HTTP OperatorMap<T>
    // interface (HTTP includes $fulltext, $overlap, etc. that Zod doesn't validate).
    // Both sides are detected by the presence of an $eq property.
    if (!isAssignable) {
      isAssignable = isOperatorMapCompatible(checker, zodPropType, httpPropType)
    }

    // String/enum compatibility: always applied regardless of lenient mode.
    // Zod string vs HTTP enum → pass (enum is a refinement for type completion).
    // Zod enum vs HTTP enum → pass only if value sets match.
    if (!isAssignable) {
      isAssignable = isStringEnumCompatible(checker, zodPropType, httpPropType)
    }

    if (!isAssignable) {
      typeMismatchFields.push({
        fieldName: name,
        expectedType: typeToDisplayString(checker, zodPropType),
        actualType: typeToDisplayString(checker, httpPropType),
      })
    }
  }

  // Fields present in HTTP but absent from Zod — the HTTP type declares something
  // the validator doesn't actually validate, so the type contract is incorrect.
  for (const [name] of httpProps) {
    if (isInternalPropertyName(name)) {
      continue
    }
    // Skip fields that come from FindParams/SelectParams — these are present in the
    // HTTP type via `extends FindParams`/`extends SelectParams` and are legitimately
    // absent from the resolved Zod type when a baseFieldsType fallback was used (but
    // are in the Zod schema chain when hasFindParams/hasSelectParams is true).
    if (
      (hasFindParams && FIND_PARAMS_FIELDS.has(name)) ||
      (hasSelectParams && SELECT_PARAMS_FIELDS.has(name))
    ) {
      continue
    }
    if (!zodProps.has(name)) {
      const httpProp = httpProps.get(name)!
      const httpPropType = checker.getTypeOfSymbol(httpProp)
      extraFields.push({
        fieldName: name,
        actualType: typeToDisplayString(checker, httpPropType),
      })
    }
  }

  return { missingFields, typeMismatchFields, extraFields }
}

/**
 * Builds a map of HTTP type name → ts.Type by scanning all provided HTTP type files.
 * Called once per checkCompatibility invocation so the lookup is O(1) per pair.
 */
function buildHttpTypeMap(
  program: ts.Program,
  checker: ts.TypeChecker,
  httpTypeFiles: string[]
): Map<string, ts.Type> {
  const map = new Map<string, ts.Type>()

  for (const filePath of httpTypeFiles) {
    const sourceFile = program.getSourceFile(filePath)
    if (!sourceFile) continue

    ts.forEachChild(sourceFile, (node) => {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node))
      ) {
        const symbol = checker.getSymbolAtLocation(node.name)
        if (symbol) {
          map.set(node.name.text, checker.getDeclaredTypeOfSymbol(symbol))
        }
      }
    })
  }

  return map
}

interface CheckSinglePairOptions {
  checker: ts.TypeChecker
  pair: CheckPair
  httpTypeMap: Map<string, ts.Type>
  lenient?: boolean
}

/**
 * Checks a single (zodType, httpType) pair for structural compatibility.
 */
function checkSinglePair({
  checker,
  pair,
  httpTypeMap,
  lenient = false,
}: CheckSinglePairOptions): CompatibilityResult {
  const { validatorName, validatorFile, httpTypeName, resolvedZodType, httpTypeFile, hasFindParams, hasSelectParams } = pair

  const httpType = httpTypeMap.get(httpTypeName)

  if (!httpType) {
    return {
      httpTypeName,
      httpTypeFile,
      validatorName,
      validatorFile,
      passed: false,
      typeNotFound: true,
      missingFields: [],
      typeMismatchFields: [],
      extraFields: [],
    }
  }

  const { missingFields, typeMismatchFields, extraFields } = diffTypes({
    checker,
    zodType: resolvedZodType,
    httpType,
    lenient,
    hasFindParams,
    hasSelectParams,
  })

  const passed =
    missingFields.length === 0 &&
    typeMismatchFields.length === 0 &&
    extraFields.length === 0

  return {
    httpTypeName,
    httpTypeFile,
    validatorName,
    validatorFile,
    passed,
    typeNotFound: false,
    missingFields,
    typeMismatchFields,
    extraFields,
  }
}

/**
 * Formats a compatibility result as a human-readable string for CLI output.
 */
export function formatCompatibilityResult(
  result: CompatibilityResult,
  verbose = false
): string {
  const lines: string[] = []

  if (result.passed) {
    if (verbose) {
      lines.push(`  PASS  ${result.httpTypeName}`)
    }
    return lines.join("\n")
  }

  const relHttpPath = result.httpTypeFile
    ? path.relative(fromRoot(), result.httpTypeFile)
    : "unknown"
  const relValidatorPath = result.validatorFile
    ? path.relative(fromRoot(), result.validatorFile)
    : "unknown"

  lines.push(`  FAIL  ${result.httpTypeName}  (${relHttpPath})`)
  lines.push(`        Zod schema: ${result.validatorName}  (${relValidatorPath})`)

  if (result.typeNotFound) {
    lines.push(
      `        HTTP type not found — run generate:http-types to create it.`
    )
    return lines.join("\n")
  }

  for (const diff of result.missingFields) {
    lines.push(
      `        Missing field: ${diff.fieldName} (expected: ${diff.expectedType})`
    )
  }

  for (const diff of result.typeMismatchFields) {
    lines.push(
      `        Type mismatch: ${diff.fieldName}`
    )
    lines.push(`          Zod schema:  ${diff.expectedType}`)
    lines.push(`          HTTP type:   ${diff.actualType}`)
  }

  for (const diff of result.extraFields) {
    lines.push(
      `        HTTP-only field: ${diff.fieldName}${diff.actualType ? ` (${diff.actualType})` : ""}`
    )
  }

  return lines.join("\n")
}
