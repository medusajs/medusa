import ts from "typescript"
import path from "path"
import { FsHelpers } from "../utils/fs-helpers"
import { TsHelpers } from "../utils/ts-helpers"
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
   * fields are expected to be present in the HTTP type via `extends FindParams`.
   */
  hasFindParams: boolean
  /** Whether the Zod schema uses createSelectParams() (but not createFindParams). */
  hasSelectParams: boolean
  /**
   * For schemas created with `createBatchBody(createValidator, updateValidator, deleteValidator?)`:
   * maps each batch property name (`create`, `update`, `delete`) to the resolved `_output` type
   * of the corresponding argument schema. This is needed because `createBatchBody` is non-generic
   * (parameters typed as `z.ZodType`), so TypeScript resolves the array element types as `unknown`.
   */
  batchBodyArgOutputTypes?: Map<string, ts.Type>
}

/**
 * Zod v4 schema method and internal property names that may leak into resolved TypeScript types.
 */
const ZOD_INTERNAL_NAMES = new Set([
  "parse",
  "parseAsync",
  "safeParse",
  "safeParseAsync",
  "refine",
  "superRefine",
  "overwrite",
  "transform",
  "default",
  "describe",
  "optional",
  "nonoptional",
  "nullable",
  "array",
  "or",
  "and",
  "brand",
  "pipe",
  "readonly",
  "catch",
  "prefault",
  "preprocess",
  "merge",
  "extend",
  "pick",
  "omit",
  "partial",
  "required",
  "keyof",
  "strip",
  "strict",
  "passthrough",
  "shape",
  "spa",
  "description",
  "isOptional",
  "isNullable",
  "check",
  "clone",
  "register",
  "encode",
  "decode",
  "encodeAsync",
  "decodeAsync",
  "safeEncode",
  "safeDecode",
  "safeEncodeAsync",
  "safeDecodeAsync",
  "toJSONSchema",
  "meta",
  "type",
  "def",
])

/**
 * Checks structural compatibility between Zod-inferred types and existing HTTP types.
 */
export class CompatibilityChecker {
  constructor(
    private readonly program: ts.Program,
    private readonly checker: ts.TypeChecker
  ) {}

  /**
   * Checks structural compatibility between Zod-inferred types and existing HTTP types
   * by performing field-level structural diffs.
   *
   * @param lenient - When true, treats `T | null | undefined` as compatible with
   *   `T | undefined` (ignores the presence of `null` in the Zod schema type).
   */
  check(
    pairs: CheckPair[],
    httpTypeFiles: string[],
    lenient = false
  ): CompatibilityResult[] {
    const httpTypeMap = this.buildHttpTypeMap(httpTypeFiles)
    return pairs.map((pair) =>
      this.checkSinglePair(pair, httpTypeMap, lenient)
    )
  }

  /**
   * Formats a compatibility result as a human-readable string for CLI output.
   */
  static formatResult(result: CompatibilityResult, verbose = false): string {
    const lines: string[] = []

    if (result.passed) {
      if (verbose) {
        lines.push(`  PASS  ${result.httpTypeName}`)
      }
      return lines.join("\n")
    }

    const relHttpPath = result.httpTypeFile
      ? path.relative(FsHelpers.fromRoot(), result.httpTypeFile)
      : "unknown"
    const relValidatorPath = result.validatorFile
      ? path.relative(FsHelpers.fromRoot(), result.validatorFile)
      : "unknown"

    lines.push(`  FAIL  ${result.httpTypeName}  (${relHttpPath})`)
    lines.push(
      `        Zod schema: ${result.validatorName}  (${relValidatorPath})`
    )

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
      lines.push(`        Type mismatch: ${diff.fieldName}`)
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

  /**
   * Builds a map of HTTP type name → ts.Type by scanning all provided HTTP type files.
   */
  private buildHttpTypeMap(httpTypeFiles: string[]): Map<string, ts.Type> {
    const map = new Map<string, ts.Type>()

    for (const filePath of httpTypeFiles) {
      const sourceFile = this.program.getSourceFile(filePath)
      if (!sourceFile) continue

      ts.forEachChild(sourceFile, (node) => {
        if (
          ts.isInterfaceDeclaration(node) ||
          ts.isTypeAliasDeclaration(node)
        ) {
          const symbol = this.checker.getSymbolAtLocation(node.name)
          if (symbol) {
            map.set(
              node.name.text,
              this.checker.getDeclaredTypeOfSymbol(symbol)
            )
          }
        }
      })
    }

    return map
  }

  /**
   * Checks a single (zodType, httpType) pair for structural compatibility.
   */
  private checkSinglePair(
    pair: CheckPair,
    httpTypeMap: Map<string, ts.Type>,
    lenient = false
  ): CompatibilityResult {
    const {
      validatorName,
      validatorFile,
      httpTypeName,
      resolvedZodType,
      httpTypeFile,
      hasFindParams,
      hasSelectParams,
    } = pair

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

    const { missingFields, typeMismatchFields, extraFields } =
      CompatibilityChecker.diffTypes({
        checker: this.checker,
        zodType: resolvedZodType,
        httpType,
        lenient,
        hasFindParams,
        hasSelectParams,
        batchBodyArgOutputTypes: pair.batchBodyArgOutputTypes,
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
   * Performs a field-level structural diff between two TypeScript types.
   */
  private static diffTypes({
    checker,
    zodType,
    httpType,
    lenient = false,
    hasFindParams = false,
    hasSelectParams = false,
    batchBodyArgOutputTypes,
  }: {
    checker: ts.TypeChecker
    zodType: ts.Type
    httpType: ts.Type
    lenient?: boolean
    hasFindParams?: boolean
    hasSelectParams?: boolean
    batchBodyArgOutputTypes?: Map<string, ts.Type>
  }): {
    missingFields: FieldDiff[]
    typeMismatchFields: FieldDiff[]
    extraFields: FieldDiff[]
  } {
    const missingFields: FieldDiff[] = []
    const typeMismatchFields: FieldDiff[] = []
    const extraFields: FieldDiff[] = []

    const zodProps = new Map<string, ts.Symbol>()
    const httpProps = new Map<string, ts.Symbol>()

    for (const prop of zodType.getProperties()) {
      zodProps.set(prop.name, prop)
    }
    for (const prop of httpType.getProperties()) {
      httpProps.set(prop.name, prop)
    }

    for (const [name, zodProp] of zodProps) {
      if (CompatibilityChecker.isInternalPropertyName(name)) {
        continue
      }

      const rawPropType = checker.getTypeOfSymbol(zodProp)

      // Skip callable properties whose return type is a Zod schema (Zod method leaks).
      const callSigs = rawPropType.getCallSignatures()
      if (callSigs.length > 0) {
        const retType = checker.getReturnTypeOfSignature(callSigs[0])
        if (
          retType.getProperty("_output") !== undefined ||
          retType.getProperty("_input") !== undefined ||
          retType.getProperty("_zod") !== undefined
        ) {
          continue
        }
      }

      // In Zod v4, the resolved object _output type may contain raw Zod schema types
      // (instead of plain TS types) for properties. Resolve them to their output types
      // so we can compare them correctly against the HTTP type.
      let zodPropType = rawPropType
      if (
        rawPropType.getProperty("_output") !== undefined ||
        rawPropType.getProperty("_input") !== undefined ||
        rawPropType.getProperty("_zod") !== undefined
      ) {
        const innerOutput = TsHelpers.getZodOutputType(checker, rawPropType)
        if (!innerOutput) {
          continue // Can't resolve — likely a Zod method leak, skip
        }
        zodPropType = innerOutput
      }

      // For createBatchBody schemas, TypeScript resolves array element types as `unknown`
      // because createBatchBody is non-generic. Use the AST-resolved arg output types instead.
      const batchElemType = batchBodyArgOutputTypes?.get(name)
      if (batchElemType !== undefined) {
        const httpProp = httpProps.get(name)
        if (httpProp && TsHelpers.hasHttpValidationIgnoreTag(httpProp)) {
          continue
        }
        if (!httpProp) {
          missingFields.push({
            fieldName: name,
            expectedType:
              TsHelpers.typeToDisplayString(checker, batchElemType) +
              "[] | undefined",
          })
          continue
        }
        const httpPropType = checker.getTypeOfSymbol(httpProp)
        const httpNonNull = checker.getNonNullableType(httpPropType)
        if (checker.isArrayType(httpNonNull)) {
          const httpElemArgs = checker.getTypeArguments(
            httpNonNull as ts.TypeReference
          )
          const httpElem = httpElemArgs[0]
          if (httpElem && checker.isTypeAssignableTo(batchElemType, httpElem)) {
            continue
          }
        }
        typeMismatchFields.push({
          fieldName: name,
          expectedType:
            TsHelpers.typeToDisplayString(checker, batchElemType) +
            "[] | undefined",
          actualType: TsHelpers.typeToDisplayString(checker, httpPropType),
        })
        continue
      }

      const httpProp = httpProps.get(name)

      if (!httpProp) {
        if (
          zodPropType.flags & ts.TypeFlags.Unknown ||
          zodPropType.flags & ts.TypeFlags.Any
        ) {
          continue
        }
        missingFields.push({
          fieldName: name,
          expectedType: TsHelpers.typeToDisplayString(checker, zodPropType),
        })
        continue
      }

      if (TsHelpers.hasHttpValidationIgnoreTag(httpProp)) {
        continue
      }

      const httpPropType = checker.getTypeOfSymbol(httpProp)

      if (
        zodPropType.flags & ts.TypeFlags.Unknown ||
        zodPropType.flags & ts.TypeFlags.Any
      ) {
        continue
      }

      let isAssignable = checker.isTypeAssignableTo(zodPropType, httpPropType)

      if (!isAssignable && lenient) {
        isAssignable = CompatibilityChecker.isLenientlyCompatible(
          checker,
          zodPropType,
          httpPropType
        )
      }

      if (!isAssignable) {
        isAssignable = CompatibilityChecker.isOperatorMapCompatible(
          checker,
          zodPropType,
          httpPropType
        )
      }

      if (!isAssignable) {
        isAssignable = CompatibilityChecker.isStringEnumCompatible(
          checker,
          zodPropType,
          httpPropType
        )
      }

      if (!isAssignable) {
        typeMismatchFields.push({
          fieldName: name,
          expectedType: TsHelpers.typeToDisplayString(checker, zodPropType),
          actualType: TsHelpers.typeToDisplayString(checker, httpPropType),
        })
      }
    }

    for (const [name] of httpProps) {
      if (CompatibilityChecker.isInternalPropertyName(name)) {
        continue
      }
      if (
        (hasFindParams && FIND_PARAMS_FIELDS.has(name)) ||
        (hasSelectParams && SELECT_PARAMS_FIELDS.has(name))
      ) {
        continue
      }
      const httpProp = httpProps.get(name)!
      if (TsHelpers.hasHttpValidationIgnoreTag(httpProp)) {
        continue
      }
      if (!zodProps.has(name)) {
        const httpPropType = checker.getTypeOfSymbol(httpProp)
        extraFields.push({
          fieldName: name,
          actualType: TsHelpers.typeToDisplayString(checker, httpPropType),
        })
      }
    }

    return { missingFields, typeMismatchFields, extraFields }
  }

  /**
   * Checks string/enum compatibility between a Zod type and an HTTP type.
   */
  private static isStringEnumCompatible(
    checker: ts.TypeChecker,
    zodType: ts.Type,
    httpType: ts.Type
  ): boolean {
    const zodBase = checker.getNonNullableType(zodType)
    const httpBase = checker.getNonNullableType(httpType)

    const zodIsString = TsHelpers.isPlainString(zodBase)
    const zodIsEnum = TsHelpers.isStringLiteralOrUnion(zodBase)
    const httpIsString = TsHelpers.isPlainString(httpBase)
    const httpIsEnum = TsHelpers.isStringLiteralOrUnion(httpBase)
    const httpIsStringEnum = TsHelpers.isStringEnumType(httpBase)

    if (zodIsString && (httpIsEnum || httpIsStringEnum)) {
      return true
    }

    if (zodIsEnum && httpIsString) {
      return true
    }

    if (zodIsEnum && httpIsEnum) {
      const zodValues = TsHelpers.getStringLiteralValues(zodBase)
      const httpValues = TsHelpers.getStringLiteralValues(httpBase)
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

    if (zodBase.isUnion() && httpBase.isUnion()) {
      const zodScalars = zodBase.types.filter((t) => !checker.isArrayType(t))
      const httpScalars = httpBase.types.filter((t) => !checker.isArrayType(t))

      if (zodScalars.length > 0 && httpScalars.length > 0) {
        const zodScalarsAreStrings = zodScalars.every(TsHelpers.isPlainString)
        const httpScalarsAreStringBased = httpScalars.every(
          (t) =>
            TsHelpers.isPlainString(t) ||
            TsHelpers.isStringLiteralOrUnion(t) ||
            TsHelpers.isStringEnumType(t)
        )

        if (zodScalarsAreStrings && httpScalarsAreStringBased) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Returns true if a type (or one of its union members) has an `$eq` property.
   */
  private static hasOperatorMapShape(type: ts.Type): boolean {
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
   */
  private static isOperatorMapCompatible(
    checker: ts.TypeChecker,
    zodType: ts.Type,
    httpType: ts.Type
  ): boolean {
    const zodNonNull = checker.getNonNullableType(zodType)
    const httpNonNull = checker.getNonNullableType(httpType)
    return (
      CompatibilityChecker.hasOperatorMapShape(zodNonNull) &&
      CompatibilityChecker.hasOperatorMapShape(httpNonNull)
    )
  }

  /**
   * Recursively checks whether `zodType` is compatible with `httpType` in lenient
   * mode, stripping `null | undefined` at each level before comparing.
   */
  private static isLenientlyCompatible(
    checker: ts.TypeChecker,
    zodType: ts.Type,
    httpType: ts.Type,
    depth = 0
  ): boolean {
    if (checker.isTypeAssignableTo(zodType, httpType)) {
      return true
    }

    const zodNonNull = checker.getNonNullableType(zodType)
    const httpNonNull = checker.getNonNullableType(httpType)

    if (checker.isTypeAssignableTo(zodNonNull, httpNonNull)) {
      return true
    }

    if (depth >= 8) {
      return false
    }

    if (zodNonNull.isUnion() && checker.isArrayType(httpNonNull)) {
      const httpElemTypes = checker.getTypeArguments(
        httpNonNull as ts.TypeReference
      )
      if (httpElemTypes.length === 1) {
        const httpElemType = httpElemTypes[0]
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

    const zodIndexInfos = checker.getIndexInfosOfType(zodNonNull)
    const httpIndexInfos = checker.getIndexInfosOfType(httpNonNull)
    if (zodIndexInfos.length > 0 && zodNonNull.getProperties().length === 0) {
      if (
        (httpIndexInfos.length > 0 &&
          httpNonNull.getProperties().length === 0) ||
        (!checker.isArrayType(httpNonNull) &&
          httpNonNull.getProperties().length > 0)
      ) {
        return true
      }
    }

    if (checker.isArrayType(zodNonNull) && checker.isArrayType(httpNonNull)) {
      const zodElem = checker.getTypeArguments(
        zodNonNull as ts.TypeReference
      )[0]
      const httpElem = checker.getTypeArguments(
        httpNonNull as ts.TypeReference
      )[0]
      if (zodElem && httpElem) {
        return CompatibilityChecker.isLenientlyCompatible(
          checker,
          zodElem,
          httpElem,
          depth + 1
        )
      }
      return false
    }

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
      if (CompatibilityChecker.isInternalPropertyName(zodProp.name)) {
        continue
      }
      const httpProp = httpPropMap.get(zodProp.name)
      if (!httpProp) {
        return false
      }
      const zodPropType = checker.getTypeOfSymbol(zodProp)
      const httpPropType = checker.getTypeOfSymbol(httpProp)

      if (
        zodPropType.flags & ts.TypeFlags.Unknown ||
        zodPropType.flags & ts.TypeFlags.Any
      ) {
        continue
      }

      if (
        !CompatibilityChecker.isLenientlyCompatible(
          checker,
          zodPropType,
          httpPropType,
          depth + 1
        )
      ) {
        return false
      }
    }

    return true
  }

  /**
   * Returns true if a property name should be skipped during structural diffing.
   */
  private static isInternalPropertyName(name: string): boolean {
    return (
      name.startsWith("_") ||
      name.startsWith("$") ||
      name.startsWith("~") ||
      ZOD_INTERNAL_NAMES.has(name)
    )
  }
}
