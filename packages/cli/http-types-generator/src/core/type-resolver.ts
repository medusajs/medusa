import ts from "typescript"
import { TsHelpers } from "../utils/ts-helpers"
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

export interface PropertyInfo {
  name: string
  type: ts.Type
  isOptional: boolean
  isOperatorMap: boolean
  /** True for fields that come from FindParams and should be omitted when extending it */
  isFindParamsField: boolean
}

/**
 * Minimum number of FindParams fields that must be present to consider
 * a type as a `FindParams`-based type.
 */
const FIND_PARAMS_THRESHOLD = 3

/**
 * Resolves TypeScript types from Zod schemas for HTTP interface generation.
 */
export class TypeResolver {
  constructor(private readonly checker: ts.TypeChecker) {}

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
  resolveSchemaType(schema: ExtractedSchema): ResolvedSchemaType | undefined {
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
      resolvedType = TsHelpers.getZodInputType(this.checker, zodType)
    } else {
      resolvedType = TsHelpers.getZodOutputType(this.checker, zodType)
    }

    if (!resolvedType) {
      return undefined
    }

    let properties = resolvedType.getProperties()

    const initialPropNames = new Set(properties.map((p) => p.name))
    const hasZodSchemaLeak =
      initialPropNames.has("parse") &&
      initialPropNames.has("safeParse") &&
      // _output = Zod v3 leak indicator; _zod = Zod v4 leak indicator
      (initialPropNames.has("_output") || initialPropNames.has("_zod"))
    const hasCircularLazyIssue =
      hasZodSchemaLeak ||
      (properties.length > 0 &&
        properties.every((p) => p.name === "$and" || p.name === "$or")) ||
      // Zod v4: TypeScript may fail to evaluate complex merged schema output types,
      // returning a type with 0 properties. Fall back to baseFieldsType if available.
      (properties.length === 0 && baseFieldsType !== undefined)

    let hasBaseFilterable = initialPropNames.has("$and")

    if (hasCircularLazyIssue && baseFieldsType) {
      const baseFieldsOutput = TsHelpers.getZodOutputType(
        this.checker,
        baseFieldsType
      )
      if (baseFieldsOutput) {
        resolvedType = baseFieldsOutput
        properties = resolvedType.getProperties()
        hasBaseFilterable = true
      }
    } else if (hasCircularLazyIssue) {
      const shapeResolved = this.resolveFromZodObjectShapeArg(zodType)
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
   * For each property in the resolved type, determines the appropriate
   * TypeScript type to emit. Applies special-case mappings for:
   * - OperatorMap fields (complex union with $eq, $ne, etc.)
   * - booleanString fields (string | boolean → boolean)
   * - FindParams fields (omit from flat interface if using extends FindParams)
   */
  resolveProperties(
    resolvedType: ts.Type,
    hasFindParams: boolean,
    hasSelectParams = false
  ): PropertyInfo[] {
    const properties = resolvedType.getProperties()
    const result: PropertyInfo[] = []

    for (const prop of properties) {
      const propName = prop.name

      if (propName === "$and" || propName === "$or") {
        continue
      }

      const rawPropType = this.checker.getTypeOfSymbol(prop)

      const zodOutput = TsHelpers.getZodOutputType(this.checker, rawPropType)
      const propType = zodOutput ?? rawPropType

      let isOptional = !!(prop.flags & ts.SymbolFlags.Optional)
      if (zodOutput) {
        const zodSymbolName = rawPropType.getSymbol()?.getName() ?? ""
        isOptional =
          zodSymbolName === "ZodOptional" ||
          zodSymbolName === "ZodNullable" ||
          zodSymbolName === "ZodDefault" ||
          zodSymbolName === "ZodPipe" // transform/preprocess
      }

      const nonNullableType = this.checker.getNonNullableType(propType)
      const isOperatorMap = TsHelpers.isOperatorMapType(nonNullableType)

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

  /**
   * Attempts to resolve schema properties directly from the ZodObject's first type
   * argument (the raw shape `T` in `ZodObject<T, ...>`).
   *
   * This is a fallback for schemas where the overall `_output` type can't be fully
   * resolved by TypeScript due to circular `z.lazy()` references.
   */
  private resolveFromZodObjectShapeArg(zodType: ts.Type): ts.Type | undefined {
    const typeRef = zodType as ts.TypeReference
    const typeArgs = this.checker.getTypeArguments(typeRef)
    if (!typeArgs || typeArgs.length === 0) {
      return undefined
    }

    const shapeType = typeArgs[0]
    if (!shapeType) {
      return undefined
    }

    const shapeProps = shapeType.getProperties()
    if (shapeProps.length === 0) {
      return undefined
    }

    return shapeType
  }
}
