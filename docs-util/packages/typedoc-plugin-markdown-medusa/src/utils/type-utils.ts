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
import { escapeChars } from "../utils"

export type Collapse = "object" | "function" | "all" | "none"

export default function getType(
  reflectionType: SomeType,
  collapse: Collapse = "none",
  emphasis = true
): string {
  if (reflectionType instanceof ReferenceType) {
    return getReferenceType(reflectionType, emphasis)
  }

  if (reflectionType instanceof ArrayType && reflectionType.elementType) {
    return getArrayType(reflectionType, emphasis)
  }

  if (reflectionType instanceof UnionType && reflectionType.types) {
    return getUnionType(reflectionType, emphasis)
  }

  if (reflectionType instanceof IntersectionType && reflectionType.types) {
    return getIntersectionType(reflectionType)
  }

  if (reflectionType instanceof TupleType && reflectionType.elements) {
    return getTupleType(reflectionType)
  }

  if (reflectionType instanceof IntrinsicType && reflectionType.name) {
    return getIntrinsicType(reflectionType, emphasis)
  }

  if (reflectionType instanceof ReflectionType) {
    return getReflectionType(reflectionType.declaration, collapse)
  }

  if (reflectionType instanceof DeclarationReflection) {
    return getReflectionType(reflectionType, collapse)
  }

  if (reflectionType instanceof TypeOperatorType) {
    return getTypeOperatorType(reflectionType)
  }

  if (reflectionType instanceof QueryType) {
    return getQueryType(reflectionType)
  }

  if (reflectionType instanceof ConditionalType) {
    return getConditionalType(reflectionType)
  }

  if (reflectionType instanceof IndexedAccessType) {
    return getIndexAccessType(reflectionType)
  }

  if (reflectionType instanceof UnknownType) {
    return getUnknownType(reflectionType)
  }

  if (reflectionType instanceof InferredType) {
    return getInferredType(reflectionType)
  }

  if (reflectionType instanceof LiteralType) {
    return getLiteralType(reflectionType)
  }

  return reflectionType ? escapeChars(reflectionType.toString()) : ""
}

export function getReflectionType(
  model: ReflectionParameterType,
  collapse: Collapse
): string {
  if ("signatures" in model && model.signatures) {
    return collapse === "function" || collapse === "all"
      ? `\`fn\``
      : getFunctionType(model.signatures)
  }
  return collapse === "object" || collapse === "all"
    ? `\`object\``
    : getDeclarationType(model as DeclarationReflection)
}

export function getDeclarationType(model: DeclarationReflection): string {
  if (model.indexSignature || model.children) {
    let indexSignature = ""
    const declarationIndexSignature = model.indexSignature
    if (declarationIndexSignature) {
      const key = declarationIndexSignature.parameters
        ? declarationIndexSignature.parameters.map(
            (param) => `\`[${param.name}: ${param.type}]\``
          )
        : ""
      const obj = declarationIndexSignature.type
        ? getType(declarationIndexSignature.type)
        : ""
      indexSignature = `${key}: ${obj}; `
    }
    const types =
      model.children &&
      model.children.map((obj) => {
        return `\`${obj.name}${obj.flags.isOptional ? "?" : ""}\`: ${
          obj.type ? getType(obj.type) : escapeChars(obj.toString())
        } ${
          obj.defaultValue && obj.defaultValue !== "..."
            ? `= ${escapeChars(`${obj.defaultValue}`)}`
            : ""
        }`
      })
    return `{ ${indexSignature ? indexSignature : ""}${
      types ? types.join("; ") : ""
    } }${
      model.defaultValue && model.defaultValue !== "..."
        ? `= ${escapeChars(`${model.defaultValue}`)}`
        : ""
    }`
  }
  return "{}"
}

export function getFunctionType(
  modelSignatures: SignatureReflection[]
): string {
  const functions = modelSignatures.map((fn) => {
    const typeParams = fn.typeParameters
      ? `<${fn.typeParameters
          .map((typeParameter) => typeParameter.name)
          .join(", ")}\\>`
      : []
    const params = fn.parameters
      ? fn.parameters.map((param) => {
          return `${param.flags.isRest ? "..." : ""}\`${param.name}${
            param.flags.isOptional ? "?" : ""
          }\`: ${
            param.type ? getType(param.type) : escapeChars(param.toString())
          }`
        })
      : []
    const returns = fn.type ? getType(fn.type) : escapeChars(fn.toString())
    return typeParams + `(${params.join(", ")}) => ${returns}`
  })
  return functions.join("")
}

export function getLiteralType(model: LiteralType): string {
  if (typeof model.value === "bigint") {
    return `\`${model.value}n\``
  }
  return `\`\`${JSON.stringify(model.value)}\`\``
}

export function getReferenceType(
  model: ReferenceType,
  emphasis: boolean
): string {
  const shouldShowLink = emphasis && model.name !== "Record"
  if (model.reflection || (model.name && model.typeArguments)) {
    const reflection: string[] = []

    if (model.reflection?.url) {
      reflection.push(
        shouldShowLink
          ? `[${`\`${model.reflection.name}\``}](${Handlebars.helpers.relativeURL(
              model.reflection.url
            )})`
          : model.reflection.name
      )
    } else {
      reflection.push(
        shouldShowLink
          ? model.externalUrl
            ? `[${`\`${model.name}\``}]( ${model.externalUrl} )`
            : `\`${model.name}\``
          : model.name
      )
    }
    if (model.typeArguments && model.typeArguments.length > 0) {
      reflection.push(
        `<${model.typeArguments
          .map((typeArgument) => getType(typeArgument, "none", emphasis))
          .join(", ")}\\>`
      )
    }
    return reflection.join("")
  }
  return shouldShowLink
    ? model.externalUrl
      ? `[${`\`${model.name}\``}]( ${model.externalUrl} )`
      : `\`${model.name}\``
    : escapeChars(model.name)
}

export function getArrayType(model: ArrayType, emphasis: boolean): string {
  const arrayType = getType(model.elementType, "none", emphasis)
  return model.elementType.type === "union"
    ? `(${arrayType})[]`
    : `${arrayType}[]`
}

export function getUnionType(model: UnionType, emphasis: boolean): string {
  return model.types
    .map((unionType) => getType(unionType, "none", emphasis))
    .join(` \\| `)
}

export function getIntersectionType(model: IntersectionType): string {
  return model.types
    .map((intersectionType) => getType(intersectionType))
    .join(" & ")
}

export function getTupleType(model: TupleType): string {
  return `[${model.elements.map((element) => getType(element)).join(", ")}]`
}

export function getIntrinsicType(
  model: IntrinsicType,
  emphasis: boolean
): string {
  return emphasis ? `\`${model.name}\`` : escapeChars(model.name)
}

export function getTypeOperatorType(model: TypeOperatorType): string {
  return `${model.operator} ${getType(model.target)}`
}

export function getQueryType(model: QueryType): string {
  return `typeof ${getType(model.queryType)}`
}

export function getInferredType(model: InferredType): string {
  return `infer ${escapeChars(model.name)}`
}

export function getUnknownType(model: UnknownType): string {
  return escapeChars(model.name)
}

export function getConditionalType(model: ConditionalType): string {
  const md: string[] = []
  if (model.checkType) {
    md.push(getType(model.checkType))
  }
  md.push("extends")
  if (model.extendsType) {
    md.push(getType(model.extendsType))
  }
  md.push("?")
  if (model.trueType) {
    md.push(getType(model.trueType))
  }
  md.push(":")
  if (model.falseType) {
    md.push(getType(model.falseType))
  }
  return md.join(" ")
}

export function getIndexAccessType(model: IndexedAccessType): string {
  const md: string[] = []
  if (model.objectType) {
    md.push(getType(model.objectType))
  }
  if (model.indexType) {
    md.push(`[${getType(model.indexType)}]`)
  }
  return md.join("")
}

export function hasTypes(parameters: TypeParameterReflection[]) {
  const types = (parameters as TypeParameterReflection[]).map(
    (param) => !!param.type || !!param.default
  )
  return !types.every((value) => !value)
}
