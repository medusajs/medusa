import {
  ArrayType,
  ConditionalType,
  DeclarationReflection,
  IndexedAccessType,
  InferredType,
  IntersectionType,
  IntrinsicType,
  LiteralType,
  QueryType,
  ReferenceType,
  ReflectionType,
  SignatureReflection,
  SomeType,
  TupleType,
  TypeOperatorType,
  TypeParameterReflection,
  UnionType,
  UnknownType,
} from "typedoc"
import * as Handlebars from "handlebars"
import { ReflectionParameterType } from "../types"
import { escapeChars, getHTMLChar } from "../utils"

export type Collapse = "object" | "function" | "all" | "none"

export default function getType(
  reflectionType: SomeType,
  collapse: Collapse = "none",
  wrapBackticks = true,
  hideLink = false,
  escape?: boolean
): string {
  if (reflectionType instanceof ReferenceType) {
    return getReferenceType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof ArrayType && reflectionType.elementType) {
    return getArrayType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof UnionType && reflectionType.types) {
    return getUnionType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof IntersectionType && reflectionType.types) {
    return getIntersectionType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof TupleType && reflectionType.elements) {
    return getTupleType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof IntrinsicType && reflectionType.name) {
    return getIntrinsicType(reflectionType, wrapBackticks, escape)
  }

  if (reflectionType instanceof ReflectionType) {
    return getReflectionType(
      reflectionType.declaration,
      collapse,
      wrapBackticks,
      hideLink
    )
  }

  if (reflectionType instanceof DeclarationReflection) {
    return getReflectionType(reflectionType, collapse, wrapBackticks, hideLink)
  }

  if (reflectionType instanceof TypeOperatorType) {
    return getTypeOperatorType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof QueryType) {
    return getQueryType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof ConditionalType) {
    return getConditionalType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof IndexedAccessType) {
    return getIndexAccessType(reflectionType, wrapBackticks, hideLink, escape)
  }

  if (reflectionType instanceof UnknownType) {
    return getUnknownType(reflectionType, escape)
  }

  if (reflectionType instanceof InferredType) {
    return getInferredType(reflectionType, escape)
  }

  if (reflectionType instanceof LiteralType) {
    return getLiteralType(reflectionType, wrapBackticks, escape)
  }

  return reflectionType ? escapeChars(reflectionType.toString()) : ""
}

export function getReflectionType(
  model: ReflectionParameterType,
  collapse: Collapse,
  wrapBackticks = true,
  hideLink = false
): string {
  if ("signatures" in model && model.signatures) {
    return collapse === "function" || collapse === "all"
      ? `${wrapBackticks ? "`" : ""}fn${wrapBackticks ? "`" : ""}`
      : getFunctionType(
          model.signatures,
          wrapBackticks,
          hideLink,
          !wrapBackticks
        )
  }
  return collapse === "object" || collapse === "all"
    ? `${wrapBackticks ? "`" : ""}object${wrapBackticks ? "`" : ""}`
    : `${wrapBackticks ? "`" : ""}${getDeclarationType(
        model as DeclarationReflection,
        wrapBackticks,
        hideLink,
        !wrapBackticks
      )}${wrapBackticks ? "`" : ""}`
}

export function getDeclarationType(
  model: DeclarationReflection,
  wrapBackticks = true,
  hideLink = false,
  escape?: boolean
): string {
  escape = getShouldEscape(wrapBackticks, escape)

  if (model.indexSignature || model.children) {
    let indexSignature = ""
    const declarationIndexSignature = model.indexSignature
    if (declarationIndexSignature) {
      const key = declarationIndexSignature.parameters
        ? declarationIndexSignature.parameters.map(
            (param) => `[${param.name}: ${param.type}]`
          )
        : ""
      const obj = declarationIndexSignature.type
        ? getType(
            declarationIndexSignature.type,
            "none",
            false,
            hideLink,
            escape
          )
        : ""
      indexSignature = `${key}: ${obj}; `
    }
    const types =
      model.children &&
      model.children.map((obj) => {
        return `${obj.name}${obj.flags.isOptional ? "?" : ""}: ${
          obj.type
            ? getType(obj.type, "none", false, hideLink, escape)
            : getFormattedStr(obj.toString(), false, escape)
        } ${
          obj.defaultValue && obj.defaultValue !== "..."
            ? `= ${getFormattedStr(`${obj.defaultValue}`, false, escape)}`
            : ""
        }`
      })
    return `${wrapBackticks ? "`{" : getHTMLChar("{")} ${
      indexSignature ? indexSignature : ""
    }${types ? types.join("; ") : ""} ${
      wrapBackticks ? "}`" : getHTMLChar("}")
    }${
      model.defaultValue && model.defaultValue !== "..."
        ? `= ${getFormattedStr(`${model.defaultValue}`, wrapBackticks, escape)}`
        : ""
    }`
  }
  return getFormattedStr("{}", wrapBackticks, escape)
}

export function getFunctionType(
  modelSignatures: SignatureReflection[],
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  escape = getShouldEscape(wrapBackticks, escape)

  const functions = modelSignatures.map((fn) => {
    const typeParams = fn.typeParameters
      ? `${wrapBackticks ? "`<" : getHTMLChar("<")}${fn.typeParameters
          .map((typeParameter) => typeParameter.name)
          .join(", ")}${wrapBackticks ? ">`" : getHTMLChar(">")}`
      : []
    const params = fn.parameters
      ? fn.parameters.map((param) => {
          return `${param.flags.isRest ? "..." : ""}${
            wrapBackticks ? "`" : ""
          }${param.name}${param.flags.isOptional ? "?" : ""}${
            wrapBackticks ? "`" : ""
          }: ${
            param.type
              ? getType(param.type, "none", wrapBackticks, hideLink, escape)
              : getFormattedStr(param.toString(), wrapBackticks, escape)
          }`
        })
      : []
    const returns = fn.type
      ? getType(fn.type, "none", wrapBackticks, hideLink, escape)
      : getFormattedStr(fn.toString(), wrapBackticks, escape)
    return typeParams + `(${params.join(", ")}) => ${returns}`
  })
  return functions.join("")
}

export function getLiteralType(
  model: LiteralType,
  wrapBackticks: boolean,
  escape?: boolean
): string {
  escape = getShouldEscape(wrapBackticks, escape)

  return getFormattedStr(
    model.value === "bigint" ? model.value : JSON.stringify(model.value),
    wrapBackticks,
    escape
  )
}

export function getReferenceType(
  model: ReferenceType,
  wrapBackticks = true,
  hideLink = false,
  escape?: boolean
): string {
  escape = getShouldEscape(wrapBackticks, escape)

  const shouldShowLink = !hideLink && model.name !== "Record"
  const wrappedInBackticks = wrapBackticks && !shouldShowLink
  if (model.reflection || (model.name && model.typeArguments)) {
    const reflection: string[] = [wrappedInBackticks ? "`" : ""]

    if (model.reflection?.url) {
      reflection.push(
        shouldShowLink
          ? `[${model.reflection.name}](${Handlebars.helpers.relativeURL(
              model.reflection.url
            )})`
          : getFormattedStr(model.reflection.name, false, escape)
      )
    } else {
      reflection.push(
        shouldShowLink
          ? model.externalUrl
            ? `[${model.name}]( ${model.externalUrl} )`
            : model.name
          : getFormattedStr(model.name, false, escape)
      )
    }
    if (model.typeArguments && model.typeArguments.length > 0) {
      reflection.push(
        `${wrappedInBackticks ? "<" : getHTMLChar("<")}${model.typeArguments
          .map((typeArgument) =>
            getType(typeArgument, "none", false, hideLink, false)
          )
          .join(", ")}${wrappedInBackticks ? ">" : getHTMLChar(">")}`
      )
    }
    if (wrappedInBackticks) {
      reflection.push("`")
    }
    return reflection.join("")
  }
  return shouldShowLink
    ? model.externalUrl
      ? `[${getFormattedStr(model.name, wrapBackticks, escape)}]( ${
          model.externalUrl
        } )`
      : getFormattedStr(model.name, wrapBackticks, escape)
    : getFormattedStr(model.name, wrapBackticks, escape)
}

export function getArrayType(
  model: ArrayType,
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  const arrayType = getType(
    model.elementType,
    "none",
    wrapBackticks,
    hideLink,
    escape
  )
  return model.elementType.type === "union"
    ? `(${arrayType})[]`
    : `${arrayType}[]`
}

export function getUnionType(
  model: UnionType,
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  return model.types
    .map((unionType) =>
      getType(unionType, "none", wrapBackticks, hideLink, escape)
    )
    .join(` \\| `)
}

export function getIntersectionType(
  model: IntersectionType,
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  return model.types
    .map((intersectionType) =>
      getType(intersectionType, "none", wrapBackticks, hideLink, escape)
    )
    .join(" & ")
}

export function getTupleType(
  model: TupleType,
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  return `[${model.elements
    .map((element) => getType(element, "none", wrapBackticks, hideLink, escape))
    .join(", ")}]`
}

export function getIntrinsicType(
  model: IntrinsicType,
  wrapBackticks: boolean,
  escape?: boolean
): string {
  escape = getShouldEscape(wrapBackticks, escape)

  return getFormattedStr(model.name, wrapBackticks, escape)
}

export function getTypeOperatorType(
  model: TypeOperatorType,
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  return `${model.operator} ${getType(
    model.target,
    "none",
    wrapBackticks,
    hideLink,
    escape
  )}`
}

export function getQueryType(
  model: QueryType,
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  return `typeof ${getType(
    model.queryType,
    "none",
    wrapBackticks,
    hideLink,
    escape
  )}`
}

export function getInferredType(model: InferredType, escape?: boolean): string {
  escape = getShouldEscape(false, escape)

  return `infer ${getFormattedStr(model.name, false, escape)}`
}

export function getUnknownType(model: UnknownType, escape?: boolean): string {
  escape = getShouldEscape(false, escape)

  return getFormattedStr(model.name, false, escape)
}

export function getConditionalType(
  model: ConditionalType,
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  const md: string[] = []
  if (model.checkType) {
    md.push(getType(model.checkType, "none", wrapBackticks, hideLink, escape))
  }
  md.push("extends")
  if (model.extendsType) {
    md.push(getType(model.extendsType, "none", wrapBackticks, hideLink, escape))
  }
  md.push("?")
  if (model.trueType) {
    md.push(getType(model.trueType, "none", wrapBackticks, hideLink, escape))
  }
  md.push(":")
  if (model.falseType) {
    md.push(getType(model.falseType, "none", wrapBackticks, hideLink, escape))
  }
  return md.join(" ")
}

export function getIndexAccessType(
  model: IndexedAccessType,
  wrapBackticks: boolean,
  hideLink = false,
  escape?: boolean
): string {
  const md: string[] = []
  if (model.objectType) {
    md.push(getType(model.objectType, "none", wrapBackticks, hideLink, escape))
  }
  if (model.indexType) {
    md.push(
      `[${getType(model.indexType, "none", wrapBackticks, hideLink, escape)}]`
    )
  }
  return md.join("")
}

export function hasTypes(parameters: TypeParameterReflection[]) {
  const types = (parameters as TypeParameterReflection[]).map(
    (param) => !!param.type || !!param.default
  )
  return !types.every((value) => !value)
}

function getShouldEscape(wrapBackticks: boolean, escape?: boolean) {
  return escape === undefined ? !wrapBackticks : escape
}

function getFormattedStr(
  str: string,
  wrapBackticks: boolean,
  escape?: boolean
) {
  return wrapBackticks ? `\`${str}\`` : escape ? escapeChars(str) : str
}
