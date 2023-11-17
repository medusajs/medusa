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
  emphasis = true,
  hideLink = false
): string {
  if (reflectionType instanceof ReferenceType) {
    return getReferenceType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof ArrayType && reflectionType.elementType) {
    return getArrayType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof UnionType && reflectionType.types) {
    return getUnionType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof IntersectionType && reflectionType.types) {
    return getIntersectionType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof TupleType && reflectionType.elements) {
    return getTupleType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof IntrinsicType && reflectionType.name) {
    return getIntrinsicType(reflectionType, emphasis)
  }

  if (reflectionType instanceof ReflectionType) {
    return getReflectionType(
      reflectionType.declaration,
      collapse,
      emphasis,
      hideLink
    )
  }

  if (reflectionType instanceof DeclarationReflection) {
    return getReflectionType(reflectionType, collapse, emphasis, hideLink)
  }

  if (reflectionType instanceof TypeOperatorType) {
    return getTypeOperatorType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof QueryType) {
    return getQueryType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof ConditionalType) {
    return getConditionalType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof IndexedAccessType) {
    return getIndexAccessType(reflectionType, emphasis, hideLink)
  }

  if (reflectionType instanceof UnknownType) {
    return getUnknownType(reflectionType)
  }

  if (reflectionType instanceof InferredType) {
    return getInferredType(reflectionType)
  }

  if (reflectionType instanceof LiteralType) {
    return getLiteralType(reflectionType, emphasis)
  }

  return reflectionType ? escapeChars(reflectionType.toString()) : ""
}

export function getReflectionType(
  model: ReflectionParameterType,
  collapse: Collapse,
  emphasis: boolean,
  hideLink = false
): string {
  if ("signatures" in model && model.signatures) {
    return collapse === "function" || collapse === "all"
      ? `${emphasis ? "`" : ""}fn${emphasis ? "`" : ""}`
      : getFunctionType(model.signatures, emphasis, hideLink)
  }
  return collapse === "object" || collapse === "all"
    ? `${emphasis ? "`" : ""}object${emphasis ? "`" : ""}`
    : `${emphasis ? "`" : ""}${getDeclarationType(
        model as DeclarationReflection,
        false,
        hideLink
      )}${emphasis ? "`" : ""}`
}

export function getDeclarationType(
  model: DeclarationReflection,
  emphasis: boolean,
  hideLink = false
): string {
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
        ? getType(declarationIndexSignature.type, "none", false, hideLink)
        : ""
      indexSignature = `${key}: ${obj}; `
    }
    const types =
      model.children &&
      model.children.map((obj) => {
        return `${obj.name}${obj.flags.isOptional ? "?" : ""}: ${
          obj.type
            ? getType(obj.type, "none", false, hideLink)
            : escapeChars(obj.toString())
        } ${
          obj.defaultValue && obj.defaultValue !== "..."
            ? `= ${escapeChars(`${obj.defaultValue}`)}`
            : ""
        }`
      })
    return `${emphasis ? "`{" : getHTMLChar("{")} ${
      indexSignature ? indexSignature : ""
    }${types ? types.join("; ") : ""} ${emphasis ? "}`" : getHTMLChar("}")}${
      model.defaultValue && model.defaultValue !== "..."
        ? `= ${escapeChars(`${model.defaultValue}`)}`
        : ""
    }`
  }
  return emphasis ? "`{}`" : escapeChars("{}")
}

export function getFunctionType(
  modelSignatures: SignatureReflection[],
  emphasis: boolean,
  hideLink = false
): string {
  const functions = modelSignatures.map((fn) => {
    const typeParams = fn.typeParameters
      ? `${emphasis ? "`<" : getHTMLChar("<")}${fn.typeParameters
          .map((typeParameter) => typeParameter.name)
          .join(", ")}${emphasis ? ">`" : getHTMLChar(">")}`
      : []
    const params = fn.parameters
      ? fn.parameters.map((param) => {
          return `${param.flags.isRest ? "..." : ""}${emphasis ? "`" : ""}${
            param.name
          }${param.flags.isOptional ? "?" : ""}${emphasis ? "`" : ""}: ${
            param.type
              ? getType(param.type, "none", emphasis, hideLink)
              : escapeChars(param.toString())
          }`
        })
      : []
    const returns = fn.type
      ? getType(fn.type, "none", emphasis, hideLink)
      : escapeChars(fn.toString())
    return typeParams + `(${params.join(", ")}) => ${returns}`
  })
  return functions.join("")
}

export function getLiteralType(model: LiteralType, emphasis: boolean): string {
  if (typeof model.value === "bigint") {
    return `${emphasis ? "`" : ""}${model.value}n${emphasis ? "`" : ""}`
  }
  return `${emphasis ? "`" : ""}\`${JSON.stringify(model.value)}\`${
    emphasis ? "`" : ""
  }`
}

export function getReferenceType(
  model: ReferenceType,
  emphasis: boolean,
  hideLink = false
): string {
  const shouldShowLink = !hideLink && model.name !== "Record"
  const wrappingBackticks = emphasis && !shouldShowLink
  if (model.reflection || (model.name && model.typeArguments)) {
    const reflection: string[] = [wrappingBackticks ? "`" : ""]

    if (model.reflection?.url) {
      reflection.push(
        shouldShowLink
          ? `[${model.reflection.name}](${Handlebars.helpers.relativeURL(
              model.reflection.url
            )})`
          : emphasis
          ? model.reflection.name
          : escapeChars(model.reflection.name)
      )
    } else {
      reflection.push(
        shouldShowLink
          ? model.externalUrl
            ? `[${model.name}]( ${model.externalUrl} )`
            : model.name
          : emphasis
          ? model.name
          : escapeChars(model.name)
      )
    }
    if (model.typeArguments && model.typeArguments.length > 0) {
      reflection.push(
        `${wrappingBackticks ? "<" : getHTMLChar("<")}${model.typeArguments
          .map((typeArgument) => getType(typeArgument, "none", false, hideLink))
          .join(", ")}${wrappingBackticks ? ">" : getHTMLChar(">")}`
      )
    }
    if (wrappingBackticks) {
      reflection.push("`")
    }
    return reflection.join("")
  }
  return shouldShowLink
    ? model.externalUrl
      ? `[${emphasis ? `\`${model.name}\`` : escapeChars(model.name)}]( ${
          model.externalUrl
        } )`
      : emphasis
      ? `\`${model.name}\``
      : escapeChars(model.name)
    : emphasis
    ? `\`${model.name}\``
    : escapeChars(model.name)
}

export function getArrayType(
  model: ArrayType,
  emphasis: boolean,
  hideLink = false
): string {
  const arrayType = getType(model.elementType, "none", emphasis, hideLink)
  return model.elementType.type === "union"
    ? `(${arrayType})[]`
    : `${arrayType}[]`
}

export function getUnionType(
  model: UnionType,
  emphasis: boolean,
  hideLink = false
): string {
  return model.types
    .map((unionType) => getType(unionType, "none", emphasis, hideLink))
    .join(` \\| `)
}

export function getIntersectionType(
  model: IntersectionType,
  emphasis: boolean,
  hideLink = false
): string {
  return model.types
    .map((intersectionType) =>
      getType(intersectionType, "none", emphasis, hideLink)
    )
    .join(" & ")
}

export function getTupleType(
  model: TupleType,
  emphasis: boolean,
  hideLink = false
): string {
  return `[${model.elements
    .map((element) => getType(element, "none", emphasis, hideLink))
    .join(", ")}]`
}

export function getIntrinsicType(
  model: IntrinsicType,
  emphasis: boolean
): string {
  return emphasis ? `\`${model.name}\`` : escapeChars(model.name)
}

export function getTypeOperatorType(
  model: TypeOperatorType,
  emphasis: boolean,
  hideLink = false
): string {
  return `${model.operator} ${getType(
    model.target,
    "none",
    emphasis,
    hideLink
  )}`
}

export function getQueryType(
  model: QueryType,
  emphasis: boolean,
  hideLink = false
): string {
  return `typeof ${getType(model.queryType, "none", emphasis, hideLink)}`
}

export function getInferredType(model: InferredType): string {
  return `infer ${escapeChars(model.name)}`
}

export function getUnknownType(model: UnknownType): string {
  return escapeChars(model.name)
}

export function getConditionalType(
  model: ConditionalType,
  emphasis: boolean,
  hideLink = false
): string {
  const md: string[] = []
  if (model.checkType) {
    md.push(getType(model.checkType, "none", emphasis, hideLink))
  }
  md.push("extends")
  if (model.extendsType) {
    md.push(getType(model.extendsType, "none", emphasis, hideLink))
  }
  md.push("?")
  if (model.trueType) {
    md.push(getType(model.trueType, "none", emphasis, hideLink))
  }
  md.push(":")
  if (model.falseType) {
    md.push(getType(model.falseType, "none", emphasis, hideLink))
  }
  return md.join(" ")
}

export function getIndexAccessType(
  model: IndexedAccessType,
  emphasis: boolean,
  hideLink = false
): string {
  const md: string[] = []
  if (model.objectType) {
    md.push(getType(model.objectType, "none", emphasis, hideLink))
  }
  if (model.indexType) {
    md.push(`[${getType(model.indexType, "none", false, hideLink)}]`)
  }
  return md.join("")
}

export function hasTypes(parameters: TypeParameterReflection[]) {
  const types = (parameters as TypeParameterReflection[]).map(
    (param) => !!param.type || !!param.default
  )
  return !types.every((value) => !value)
}
