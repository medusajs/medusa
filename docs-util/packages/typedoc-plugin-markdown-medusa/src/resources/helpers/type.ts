import * as Handlebars from "handlebars"
import {
  ArrayType,
  ConditionalType,
  DeclarationReflection,
  IndexedAccessType,
  InferredType,
  IntersectionType,
  IntrinsicType,
  LiteralType,
  PredicateType,
  QueryType,
  ReferenceType,
  ReflectionType,
  SignatureReflection,
  TupleType,
  TypeOperatorType,
  UnionType,
  UnknownType,
} from "typedoc"
import { escapeChars } from "../../utils"
import { ReflectionParameterType } from "../../types"

type Collapse = "object" | "function" | "all" | "none"

export default function () {
  Handlebars.registerHelper(
    "type",
    function (
      this:
        | ArrayType
        | IntersectionType
        | IntrinsicType
        | ReferenceType
        | TupleType
        | UnionType
        | TypeOperatorType
        | QueryType
        | PredicateType
        | ReferenceType
        | ConditionalType
        | IndexedAccessType
        | UnknownType
        | InferredType,

      collapse: Collapse = "none",
      emphasis = true
    ) {
      if (this instanceof ReferenceType) {
        return getReferenceType(this, emphasis)
      }

      if (this instanceof ArrayType && this.elementType) {
        return getArrayType(this, emphasis)
      }

      if (this instanceof UnionType && this.types) {
        return getUnionType(this, emphasis)
      }

      if (this instanceof IntersectionType && this.types) {
        return getIntersectionType(this)
      }

      if (this instanceof TupleType && this.elements) {
        return getTupleType(this)
      }

      if (this instanceof IntrinsicType && this.name) {
        return getIntrinsicType(this, emphasis)
      }

      if (this instanceof ReflectionType) {
        return getReflectionType(this, collapse)
      }

      if (this instanceof DeclarationReflection) {
        return getReflectionType(this, collapse)
      }

      if (this instanceof TypeOperatorType) {
        return getTypeOperatorType(this)
      }

      if (this instanceof QueryType) {
        return getQueryType(this)
      }

      if (this instanceof ConditionalType) {
        return getConditionalType(this)
      }

      if (this instanceof IndexedAccessType) {
        return getIndexAccessType(this)
      }

      if (this instanceof UnknownType) {
        return getUnknownType(this)
      }

      if (this instanceof InferredType) {
        return getInferredType(this)
      }

      if (this instanceof LiteralType) {
        return getLiteralType(this)
      }

      return this ? escapeChars(this.toString()) : ""
    }
  )
}

function getLiteralType(model: LiteralType) {
  if (typeof model.value === "bigint") {
    return `\`${model.value}n\``
  }
  return `\`\`${JSON.stringify(model.value)}\`\``
}

export function getReflectionType(
  model: ReflectionParameterType,
  collapse: Collapse
) {
  const root = model instanceof ReflectionType ? model.declaration : model
  if ("signatures" in root && root.signatures) {
    return collapse === "function" || collapse === "all"
      ? `\`fn\``
      : getFunctionType(root.signatures)
  }
  return collapse === "object" || collapse === "all"
    ? `\`Object\``
    : getDeclarationType(root as DeclarationReflection)
}

export function getDeclarationType(model: DeclarationReflection) {
  if (model.indexSignature || model.children) {
    let indexSignature = ""
    const declarationIndexSignature = model.indexSignature
    if (declarationIndexSignature) {
      const key = declarationIndexSignature.parameters
        ? declarationIndexSignature.parameters.map(
            (param) => `\`[${param.name}: ${param.type}]\``
          )
        : ""
      const obj = Handlebars.helpers.type.call(declarationIndexSignature.type)
      indexSignature = `${key}: ${obj}; `
    }
    const types =
      model.children &&
      model.children.map((obj) => {
        return `\`${obj.name}${
          obj.flags.isOptional ? "?" : ""
        }\`: ${Handlebars.helpers.type.call(
          obj.signatures || obj.children ? obj : obj.type
        )} ${
          obj.defaultValue && obj.defaultValue !== "..."
            ? `= ${escapeChars(obj.defaultValue)}`
            : ""
        }`
      })
    return `{ ${indexSignature ? indexSignature : ""}${
      types ? types.join("; ") : ""
    } }${
      model.defaultValue && model.defaultValue !== "..."
        ? `= ${escapeChars(model.defaultValue)}`
        : ""
    }`
  }
  return "{}"
}

export function getFunctionType(modelSignatures: SignatureReflection[]) {
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
          }\`: ${Handlebars.helpers.type.call(param.type ? param.type : param)}`
        })
      : []
    const returns = Handlebars.helpers.type.call(fn.type)
    return typeParams + `(${params.join(", ")}) => ${returns}`
  })
  return functions.join("")
}

export function getReferenceType(model: ReferenceType, emphasis: boolean) {
  if (model.reflection || (model.name && model.typeArguments)) {
    const reflection: string[] = []

    if (model.reflection?.url) {
      reflection.push(
        emphasis
          ? `[${`\`${model.reflection.name}\``}](${Handlebars.helpers.relativeURL(
              model.reflection.url
            )})`
          : model.reflection.name
      )
    } else {
      reflection.push(
        emphasis
          ? model.externalUrl
            ? `[${`\`${model.name}\``}]( ${model.externalUrl} )`
            : `\`${model.name}\``
          : model.name
      )
    }
    if (model.typeArguments && model.typeArguments.length > 0) {
      reflection.push(
        `<${model.typeArguments
          .map((typeArgument) =>
            Handlebars.helpers.type.call(typeArgument, "none", emphasis)
          )
          .join(", ")}\\>`
      )
    }
    return reflection.join("")
  }
  return emphasis
    ? model.externalUrl
      ? `[${`\`${model.name}\``}]( ${model.externalUrl} )`
      : `\`${model.name}\``
    : escapeChars(model.name)
}

export function getArrayType(model: ArrayType, emphasis: boolean) {
  const arrayType = Handlebars.helpers.type.call(
    model.elementType,
    "none",
    emphasis
  )
  return model.elementType.type === "union"
    ? `(${arrayType})[]`
    : `${arrayType}[]`
}

export function getUnionType(model: UnionType, emphasis: boolean) {
  return model.types
    .map((unionType) =>
      Handlebars.helpers.type.call(unionType, "none", emphasis)
    )
    .join(` \\| `)
}

export function getIntersectionType(model: IntersectionType) {
  return model.types
    .map((intersectionType) => Handlebars.helpers.type.call(intersectionType))
    .join(" & ")
}

export function getTupleType(model: TupleType) {
  return `[${model.elements
    .map((element) => Handlebars.helpers.type.call(element))
    .join(", ")}]`
}

export function getIntrinsicType(model: IntrinsicType, emphasis: boolean) {
  return emphasis ? `\`${model.name}\`` : escapeChars(model.name)
}

export function getTypeOperatorType(model: TypeOperatorType) {
  return `${model.operator} ${Handlebars.helpers.type.call(model.target)}`
}

export function getQueryType(model: QueryType) {
  return `typeof ${Handlebars.helpers.type.call(model.queryType)}`
}

export function getInferredType(model: InferredType) {
  return `infer ${escapeChars(model.name)}`
}

export function getUnknownType(model: UnknownType) {
  return escapeChars(model.name)
}

export function getConditionalType(model: ConditionalType) {
  const md: string[] = []
  if (model.checkType) {
    md.push(Handlebars.helpers.type.call(model.checkType))
  }
  md.push("extends")
  if (model.extendsType) {
    md.push(Handlebars.helpers.type.call(model.extendsType))
  }
  md.push("?")
  if (model.trueType) {
    md.push(Handlebars.helpers.type.call(model.trueType))
  }
  md.push(":")
  if (model.falseType) {
    md.push(Handlebars.helpers.type.call(model.falseType))
  }
  return md.join(" ")
}

export function getIndexAccessType(model: IndexedAccessType) {
  const md: string[] = []
  if (model.objectType) {
    md.push(Handlebars.helpers.type.call(model.objectType))
  }
  if (model.indexType) {
    md.push(`[${Handlebars.helpers.type.call(model.indexType)}]`)
  }
  return md.join("")
}
