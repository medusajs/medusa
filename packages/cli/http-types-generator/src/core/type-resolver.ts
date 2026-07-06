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
  /**
   * The raw Zod-shape type (the first type argument of `ZodObject<Shape>`),
   * used as a fallback source of per-property Zod schema info when the
   * inferred output for a property is degraded to `any` by complex types
   * (e.g. `createOperatorMap()` returning `any` through `_output`).
   */
  zodShapeType?: ts.Type
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

    let zodShapeType: ts.Type | undefined =
      this.resolveFromZodObjectShapeArg(zodType)

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
      const baseFieldsShape = this.resolveFromZodObjectShapeArg(baseFieldsType)
      if (baseFieldsShape) {
        zodShapeType = baseFieldsShape
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
      zodShapeType,
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
    hasSelectParams = false,
    zodShapeType?: ts.Type
  ): PropertyInfo[] {
    const properties = resolvedType.getProperties()
    const result: PropertyInfo[] = []
    const shapeProps = new Map<string, ts.Symbol>()
    if (zodShapeType) {
      for (const p of zodShapeType.getProperties()) {
        shapeProps.set(p.name, p)
      }
    }

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
      let isOperatorMap = TsHelpers.isOperatorMapType(nonNullableType)

      // Fallback for the shape-arg path: when `_output` couldn't be fully
      // resolved by TypeScript (typically due to `z.lazy()` circular
      // references introduced by `applyAndAndOrOperators`), the resolved
      // `propType` may be `any` or a degraded type that doesn't expose the
      // OperatorMap members. Inspect the raw Zod schema's structure directly
      // to detect `createOperatorMap()`.
      if (!isOperatorMap && TsHelpers.isZodType(rawPropType)) {
        isOperatorMap = TsHelpers.isOperatorMapZodSchema(
          this.checker,
          rawPropType
        )
      }
      if (!isOperatorMap) {
        const shapeProp = shapeProps.get(propName)
        if (shapeProp) {
          const shapePropType = this.checker.getTypeOfSymbol(shapeProp)
          if (TsHelpers.isZodType(shapePropType)) {
            isOperatorMap = TsHelpers.isOperatorMapZodSchema(
              this.checker,
              shapePropType
            )
            if (isOperatorMap && !isOptional) {
              const shapeSymbolName =
                shapePropType.getSymbol()?.getName() ?? ""
              if (
                shapeSymbolName === "ZodOptional" ||
                shapeSymbolName === "ZodNullable" ||
                shapeSymbolName === "ZodDefault" ||
                shapeSymbolName === "ZodPipe"
              ) {
                isOptional = true
              }
            }
          }
        }
      }

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
