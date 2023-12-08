/* eslint-disable no-case-declarations */
import {
  FunctionSignatureType,
  ObjectSignatureType,
  TSFunctionSignatureType,
  TypeDescriptor,
} from "react-docgen/dist/Documentation.js"
import { SomeType } from "typedoc"
import { getType } from "utils"

type TsType = TypeDescriptor<TSFunctionSignatureType>

export default function getTsType(
  reflectionType: SomeType
): TsType | undefined {
  const rawValue = getType({
    reflectionType,
    hideLink: true,
    wrapBackticks: false,
  })
  switch (reflectionType.type) {
    case "array": {
      const elements = getTsType(reflectionType.elementType)
      return {
        name: "Array",
        elements: elements ? [elements] : [],
        raw: rawValue,
      }
    }
    case "reference":
      const elements =
        reflectionType.reflection && "type" in reflectionType.reflection
          ? getTsType(reflectionType.reflection.type as SomeType)
          : undefined
      return {
        name: reflectionType.name,
        elements: elements ? [elements] : [],
        raw: rawValue,
      }
    case "reflection":
      const reflection = reflectionType.declaration
      if (reflection.signatures?.length) {
        const typeData: FunctionSignatureType = {
          name: "signature",
          type: "function",
          raw: rawValue,
          signature: {
            arguments: [],
            return: undefined,
          },
        }

        if (reflection.signatures?.length) {
          reflection.signatures[0].parameters?.forEach((parameter) => {
            const parameterType = parameter.type
              ? getTsType(parameter.type)
              : undefined
            typeData.signature.arguments.push({
              name: parameter.name,
              type: parameterType,
              rest: parameter.flags.isRest,
            })
          })

          typeData.signature.return = reflection.signatures[0].type
            ? getTsType(reflection.signatures[0].type)
            : undefined
        }

        return typeData
      } else {
        const typeData: ObjectSignatureType = {
          name: "signature",
          type: "object",
          raw: rawValue,
          signature: {
            properties: [],
          },
        }

        reflection.children?.map((property) => {
          typeData.signature.properties.push({
            key: property.name,
            value: property.type
              ? getTsType(property.type) || {
                  name: "unknown",
                }
              : {
                  name: "unknown",
                },
            description: property.comment?.summary
              .map(({ text }) => text)
              .join(" "),
          })
        })

        return typeData
      }
    case "literal":
      if (reflectionType.value === null) {
        return {
          name: `null`,
        }
      }
      return {
        name: "literal",
        value: rawValue,
      }
    case "union":
    case "intersection":
      return {
        name: reflectionType.type,
        raw: rawValue,
        elements: getElementsTypes(reflectionType.types),
      }
    case "tuple":
      return {
        name: "tuple",
        raw: rawValue,
        elements: getElementsTypes(reflectionType.elements),
      }
    default:
      return {
        name: rawValue,
      }
  }
}

function getElementsTypes(elements: SomeType[]): TsType[] {
  const elementData: TsType[] = []

  elements.forEach((element) => {
    const tupleType = getTsType(element)
    if (tupleType) {
      elementData.push(tupleType)
    }
  })

  return elementData
}
