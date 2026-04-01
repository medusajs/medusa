import ts from "typescript"
import {
  getZodInputType,
  getZodOutputType,
  isOperatorMapType,
} from "../utils/ts-helpers"
import type { ExtractedSchema } from "./schema-extractor"

export interface ResolvedSchemaType {
  /** The resolved TypeScript type representing the HTTP interface shape */
  type: ts.Type
  /** Whether this type has special fields that need `FindParams` as a base */
  hasFindParams: boolean
  /** Whether this type only has the `fields` property from `SelectParams` */
  hasSelectParams: boolean
  /** Whether this type has `$and`/`$or` operators (BaseFilterable) */
  hasBaseFilterable: boolean
  /** The schema name for diagnostic reporting */
  schemaName: string
}

/** Property names that belong to `FindParams` (superset of SelectParams) */
export const FIND_PARAMS_FIELDS = new Set([
  "fields",
  "limit",
  "offset",
  "order",
  "with_deleted",
])

/** Property names that belong to `SelectParams` only */
export const SELECT_PARAMS_FIELDS = new Set(["fields"])

/**
 * Minimum number of FindParams fields that must be present to consider
 * a type as a `FindParams`-based type.
 */
const FIND_PARAMS_THRESHOLD = 3

/**
 * Resolves the TypeScript type that should be used to generate the HTTP
 * interface for a given Zod schema.
 *
 * Decision logic:
 * - For `WithAdditionalData` wrappers (innerSchemaType present): use `_output`
 *   of the inner schema (no transforms on payloads).
 * - For schemas with `.transform()` (ZodEffects): use `_input` type, which
 *   represents what the HTTP client sends (pre-transform).
 * - For plain ZodObjects without transforms: use `_output` type.
 * - `createFindParams()` fields (limit, offset, etc.) use `_output` because
 *   `z.preprocess()` has `unknown` as input but `number` as output.
 */
export function resolveSchemaType(
  checker: ts.TypeChecker,
  schema: ExtractedSchema
): ResolvedSchemaType | undefined {
  const {
    zodType,
    hasTransform,
    httpTypeName,
    baseFieldsType,
    hasFindParamsInChain,
    hasSelectParamsInChain,
  } = schema

  let resolvedType: ts.Type | undefined

  if (hasTransform) {
    // For schemas with transforms, use the _input type (pre-transform).
    // This represents what HTTP clients actually send.
    resolvedType = getZodInputType(checker, zodType)
  } else {
    // For plain schemas (including WithAdditionalData inner schemas),
    // use the _output type.
    resolvedType = getZodOutputType(checker, zodType)
  }

  if (!resolvedType) {
    return undefined
  }

  let properties = resolvedType.getProperties()

  // Detect if the resolved type has the circular lazy type issue:
  // (a) only $and/$or properties are visible (from applyAndAndOrOperators at top level), or
  // (b) the resolved type contains Zod schema methods (parse, safeParse, etc.), which
  //     indicates TypeScript returned the Zod schema class type instead of the inferred type.
  const initialPropNames = new Set(properties.map((p) => p.name))
  const hasZodSchemaLeak =
    initialPropNames.has("parse") &&
    initialPropNames.has("safeParse") &&
    initialPropNames.has("_output")
  const hasCircularLazyIssue =
    hasZodSchemaLeak ||
    (properties.length > 0 &&
      properties.every((p) => p.name === "$and" || p.name === "$or"))

  let hasBaseFilterable = initialPropNames.has("$and")

  if (hasCircularLazyIssue && baseFieldsType) {
    // Use the base fields schema type (e.g., AdminCustomersParamsFields._output)
    // instead of the fully-merged schema's _output.
    const baseFieldsOutput = getZodOutputType(checker, baseFieldsType)
    if (baseFieldsOutput) {
      resolvedType = baseFieldsOutput
      properties = resolvedType.getProperties()
      hasBaseFilterable = true // We know it has applyAndAndOrOperators
    }
  } else if (hasCircularLazyIssue) {
    // Can't recover — try shape argument fallback
    const shapeResolved = resolveFromZodObjectShapeArg(checker, zodType)
    if (shapeResolved) {
      resolvedType = shapeResolved
      properties = resolvedType.getProperties()
      hasBaseFilterable = true
    }
  }

  const propNames = new Set(properties.map((p) => p.name))

  let findParamsFieldCount = 0
  for (const f of FIND_PARAMS_FIELDS) {
    if (propNames.has(f)) findParamsFieldCount++
  }
  const hasFindParams =
    findParamsFieldCount >= FIND_PARAMS_THRESHOLD || hasFindParamsInChain
  // hasSelectParams is true only when createSelectParams is in the chain but
  // NOT createFindParams (which is a superset and takes precedence).
  const hasSelectParams = !hasFindParams && hasSelectParamsInChain

  return {
    type: resolvedType,
    hasFindParams,
    hasSelectParams,
    hasBaseFilterable,
    schemaName: httpTypeName,
  }
}

/**
 * Attempts to resolve schema properties directly from the ZodObject's first type
 * argument (the raw shape `T` in `ZodObject<T, ...>`).
 *
 * This is a fallback for schemas where the overall `_output` type can't be fully
 * resolved by TypeScript due to circular `z.lazy()` references (as in `applyAndAndOrOperators`).
 *
 * For each property in the shape, we resolve its `_output` individually to get the
 * actual property type, then synthesize a new TypeScript object type.
 */
function resolveFromZodObjectShapeArg(
  checker: ts.TypeChecker,
  zodType: ts.Type
): ts.Type | undefined {
  // ZodObject<T, ...> — get the first type argument T (the shape)
  const typeRef = zodType as ts.TypeReference
  const typeArgs = checker.getTypeArguments(typeRef)
  if (!typeArgs || typeArgs.length === 0) {
    return undefined
  }

  const shapeType = typeArgs[0]
  if (!shapeType) {
    return undefined
  }

  // Each property of the shape is a Zod type; get its _output
  const shapeProps = shapeType.getProperties()
  if (shapeProps.length === 0) {
    return undefined
  }

  // Build a synthetic type from the resolved properties.
  // We collect the property symbols with their resolved output types.
  // Then we synthesize an anonymous object type using a trick:
  // create a mapped-type-like structure using the checker's createAnonymousType.
  // Unfortunately, TypeScript's public API doesn't have createAnonymousType.
  // Instead, return the shape type itself — the emitter can work with it
  // by resolving each property's _output type during emission.
  return shapeType
}

/**
 * For each property in the resolved type, determines the appropriate
 * TypeScript type to emit. Applies special-case mappings for:
 * - OperatorMap fields (complex union with $eq, $ne, etc.)
 * - booleanString fields (string | boolean → boolean)
 * - FindParams fields (omit from flat interface if using extends FindParams)
 */
export interface PropertyInfo {
  name: string
  type: ts.Type
  isOptional: boolean
  isOperatorMap: boolean
  /** True for fields that come from FindParams and should be omitted when extending it */
  isFindParamsField: boolean
}

export function resolveProperties(
  checker: ts.TypeChecker,
  resolvedType: ts.Type,
  hasFindParams: boolean,
  hasSelectParams = false,
): PropertyInfo[] {
  const properties = resolvedType.getProperties()
  const result: PropertyInfo[] = []

  for (const prop of properties) {
    const propName = prop.name

    // Skip $and/$or — they come from BaseFilterable and will be represented
    // via the `extends BaseFilterable<T>` heritage clause instead
    if (propName === "$and" || propName === "$or") {
      continue
    }

    const rawPropType = checker.getTypeOfSymbol(prop)

    // Handle two cases:
    // 1. If rawPropType is a Zod type (has _output), this is a shape type from the
    //    fallback path — resolve each property's output type individually
    // 2. Otherwise it's already a resolved TS type
    const zodOutput = getZodOutputType(checker, rawPropType)
    const propType = zodOutput ?? rawPropType

    // Optionality:
    // - In the shape-type (fallback) case: check if the Zod type is ZodOptional/ZodNullable
    // - In the normal case: check ts.SymbolFlags.Optional
    let isOptional = !!(prop.flags & ts.SymbolFlags.Optional)
    if (zodOutput) {
      // Shape-type case — check Zod type wrapper
      const zodSymbolName = rawPropType.getSymbol()?.getName() ?? ""
      isOptional =
        zodSymbolName === "ZodOptional" ||
        zodSymbolName === "ZodNullable" ||
        zodSymbolName === "ZodDefault" ||
        // ZodEffects with preprocess is also "optional" in practice
        zodSymbolName === "ZodEffects"
    }

    // Detect OperatorMap pattern
    const nonNullableType = checker.getNonNullableType(propType)
    const isOperatorMap = isOperatorMapType(nonNullableType)

    // Mark fields that come from a base params type (FindParams or SelectParams)
    // so the emitter can omit them from the inline body when extending that type.
    const isFindParamsField =
      (hasFindParams && FIND_PARAMS_FIELDS.has(propName)) ||
      (hasSelectParams && SELECT_PARAMS_FIELDS.has(propName))

    result.push({
      name: propName,
      type: propType,
      isOptional,
      isOperatorMap,
      isFindParamsField,
    })
  }

  return result
}
