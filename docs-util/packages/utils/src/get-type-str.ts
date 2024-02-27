import {
  ArrayType,
  ConditionalType,
  DeclarationReflection,
  IndexedAccessType,
  InferredType,
  IntersectionType,
  IntrinsicType,
  LiteralType,
  ParameterReflection,
  ProjectReflection,
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
import { escapeChars, getHTMLChar } from "./str-utils"
import { getProjectChild } from "./get-project-child"

export type ReflectionParameterType =
  | ParameterReflection
  | DeclarationReflection
  | TypeParameterReflection

export type Collapse = "object" | "function" | "all" | "none"

export type TypeOptions<T = SomeType> = {
  reflectionType: T
  collapse?: Collapse
  wrapBackticks?: boolean
  hideLink?: boolean
  escape?: boolean
  project?: ProjectReflection
  getRelativeUrlMethod?: (url: string) => string
}

export function getType({ reflectionType, ...options }: TypeOptions): string {
  if (reflectionType instanceof ReferenceType) {
    return getReferenceType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof ArrayType && reflectionType.elementType) {
    return getArrayType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof UnionType && reflectionType.types) {
    return getUnionType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof IntersectionType && reflectionType.types) {
    return getIntersectionType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof TupleType && reflectionType.elements) {
    return getTupleType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof IntrinsicType && reflectionType.name) {
    return getIntrinsicType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof ReflectionType) {
    return getReflectionType({
      reflectionType: reflectionType.declaration,
      ...options,
    })
  }

  if (reflectionType instanceof DeclarationReflection) {
    return getReflectionType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof TypeOperatorType) {
    return getTypeOperatorType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof QueryType) {
    return getQueryType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof ConditionalType) {
    return getConditionalType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof IndexedAccessType) {
    return getIndexAccessType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof UnknownType) {
    return getUnknownType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof InferredType) {
    return getInferredType({
      reflectionType,
      ...options,
    })
  }

  if (reflectionType instanceof LiteralType) {
    return getLiteralType({
      reflectionType,
      ...options,
    })
  }

  return reflectionType ? escapeChars(reflectionType.toString()) : ""
}

export function getReflectionType({
  reflectionType: model,
  collapse,
  wrapBackticks = true,
  hideLink = false,
  ...options
}: TypeOptions<ReflectionParameterType>): string {
  if ("signatures" in model && model.signatures) {
    return collapse === "function" || collapse === "all"
      ? `${wrapBackticks ? "`" : ""}fn${wrapBackticks ? "`" : ""}`
      : getFunctionType({
          modelSignatures: model.signatures,
          wrapBackticks,
          hideLink,
          escape: !wrapBackticks,
          ...options,
        })
  }
  return collapse === "object" || collapse === "all"
    ? `${wrapBackticks ? "`" : ""}object${wrapBackticks ? "`" : ""}`
    : `${wrapBackticks ? "`" : ""}${getDeclarationType({
        reflectionType: model as DeclarationReflection,
        wrapBackticks,
        hideLink,
        escape: !wrapBackticks,
        ...options,
      })}${wrapBackticks ? "`" : ""}`
}

export function getDeclarationType({
  reflectionType: model,
  wrapBackticks = true,
  hideLink = false,
  escape,
  ...options
}: TypeOptions<DeclarationReflection>): string {
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
        ? getType({
            reflectionType: declarationIndexSignature.type,
            wrapBackticks: false,
            hideLink,
            escape,
            ...options,
          })
        : ""
      indexSignature = `${key}: ${obj}; `
    }
    const types =
      model.children &&
      model.children.map((obj) => {
        return `${obj.name}${obj.flags.isOptional ? "?" : ""}: ${
          obj.type
            ? getType({
                reflectionType: obj.type,
                wrapBackticks: false,
                hideLink,
                escape,
                ...options,
              })
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

export function getFunctionType({
  modelSignatures,
  wrapBackticks = true,
  hideLink = false,
  escape,
  ...options
}: Omit<TypeOptions, "reflectionType"> & {
  modelSignatures: SignatureReflection[]
}): string {
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
              ? getType({
                  reflectionType: param.type,
                  wrapBackticks,
                  hideLink,
                  escape,
                  ...options,
                })
              : getFormattedStr(param.toString(), wrapBackticks, escape)
          }`
        })
      : []
    const returns = fn.type
      ? getType({
          reflectionType: fn.type,
          wrapBackticks,
          hideLink,
          escape,
          ...options,
        })
      : getFormattedStr(fn.toString(), wrapBackticks, escape)
    return typeParams + `(${params.join(", ")}) => ${returns}`
  })
  return functions.join("")
}

export function getLiteralType({
  reflectionType: model,
  wrapBackticks = true,
  escape,
}: TypeOptions<LiteralType>): string {
  escape = getShouldEscape(wrapBackticks, escape)

  return getFormattedStr(
    model.value === "bigint" ? model.value : JSON.stringify(model.value),
    wrapBackticks,
    escape
  )
}

export function getReferenceType({
  reflectionType: model,
  wrapBackticks = true,
  hideLink = false,
  escape,
  project,
  getRelativeUrlMethod,
  ...options
}: TypeOptions<ReferenceType>): string {
  const shouldShowLink = !hideLink && model.name !== "Record"
  const wrappedInBackticks = wrapBackticks && !shouldShowLink
  escape = getShouldEscape(wrappedInBackticks, escape)
  let modelReflection = model.reflection
  if (!modelReflection && project) {
    // try to load reflection
    modelReflection = getProjectChild(project!, model.name)
  }
  if (modelReflection || (model.name && model.typeArguments)) {
    const reflection: string[] = [wrappedInBackticks ? "`" : ""]

    if (modelReflection?.url) {
      reflection.push(
        shouldShowLink
          ? `[${modelReflection.name}](${
              getRelativeUrlMethod?.(modelReflection.url) || modelReflection.url
            })`
          : getFormattedStr(modelReflection.name, false, escape)
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
            getType({
              reflectionType: typeArgument,
              wrapBackticks: false,
              hideLink,
              escape: false,
              getRelativeUrlMethod,
              ...options,
            })
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

export function getArrayType({
  reflectionType: model,
  hideLink = false,
  ...options
}: TypeOptions<ArrayType>): string {
  const arrayType = getType({
    reflectionType: model.elementType,
    hideLink,
    ...options,
  })
  return model.elementType.type === "union"
    ? `(${arrayType})[]`
    : `${arrayType}[]`
}

export function getUnionType({
  reflectionType: model,
  hideLink = false,
  ...options
}: TypeOptions<UnionType>): string {
  return model.types
    .map((unionType) =>
      getType({
        reflectionType: unionType,
        hideLink,
        ...options,
      })
    )
    .join(` \\| `)
}

export function getIntersectionType({
  reflectionType: model,
  hideLink = false,
  ...options
}: TypeOptions<IntersectionType>): string {
  return model.types
    .map((intersectionType) =>
      getType({
        reflectionType: intersectionType,
        hideLink,
        ...options,
      })
    )
    .join(" & ")
}

export function getTupleType({
  reflectionType: model,
  hideLink = false,
  ...options
}: TypeOptions<TupleType>): string {
  return `[${model.elements
    .map((element) =>
      getType({
        reflectionType: element,
        hideLink,
        ...options,
      })
    )
    .join(", ")}]`
}

export function getIntrinsicType({
  reflectionType: model,
  wrapBackticks = true,
  escape,
}: TypeOptions<IntrinsicType>): string {
  escape = getShouldEscape(wrapBackticks, escape)

  return getFormattedStr(model.name, wrapBackticks, escape)
}

export function getTypeOperatorType({
  reflectionType: model,
  hideLink = false,
  ...options
}: TypeOptions<TypeOperatorType>): string {
  return `${model.operator} ${getType({
    reflectionType: model.target,
    hideLink,
    ...options,
  })}`
}

export function getQueryType({
  reflectionType: model,
  hideLink = false,
  ...options
}: TypeOptions<QueryType>): string {
  return `typeof ${getType({
    reflectionType: model.queryType,
    hideLink,
    ...options,
  })}`
}

export function getInferredType({
  reflectionType: model,
  escape,
}: TypeOptions<InferredType>): string {
  escape = getShouldEscape(false, escape)

  return `infer ${getFormattedStr(model.name, false, escape)}`
}

export function getUnknownType({
  reflectionType: model,
  escape,
}: TypeOptions<UnknownType>): string {
  escape = getShouldEscape(false, escape)

  return getFormattedStr(model.name, false, escape)
}

export function getConditionalType({
  reflectionType: model,
  hideLink = false,
  ...options
}: TypeOptions<ConditionalType>): string {
  const md: string[] = []
  if (model.checkType) {
    md.push(
      getType({
        reflectionType: model.checkType,
        hideLink,
        ...options,
      })
    )
  }
  md.push("extends")
  if (model.extendsType) {
    md.push(
      getType({
        reflectionType: model.extendsType,
        hideLink,
        ...options,
      })
    )
  }
  md.push("?")
  if (model.trueType) {
    md.push(
      getType({
        reflectionType: model.trueType,
        hideLink,
        ...options,
      })
    )
  }
  md.push(":")
  if (model.falseType) {
    md.push(
      getType({
        reflectionType: model.falseType,
        hideLink,
        ...options,
      })
    )
  }
  return md.join(" ")
}

export function getIndexAccessType({
  reflectionType: model,
  hideLink = false,
  ...options
}: TypeOptions<IndexedAccessType>): string {
  const md: string[] = []
  if (model.objectType) {
    md.push(
      getType({
        reflectionType: model.objectType,
        hideLink,
        ...options,
      })
    )
  }
  if (model.indexType) {
    md.push(
      `[${getType({
        reflectionType: model.indexType,
        hideLink,
        ...options,
      })}]`
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
