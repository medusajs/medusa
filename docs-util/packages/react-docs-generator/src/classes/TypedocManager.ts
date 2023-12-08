/* eslint-disable no-case-declarations */
import { Documentation } from "react-docgen"
import {
  FunctionSignatureType,
  ObjectSignatureType,
  TSFunctionSignatureType,
  TypeDescriptor,
} from "react-docgen/dist/Documentation.js"
import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  ProjectReflection,
  Reflection,
  SignatureReflection,
  SomeType,
  SourceReference,
} from "typedoc"
import { getType, getTypeChildren } from "utils"

type MappedReflectionSignature = {
  source: SourceReference
  signatures: SignatureReflection[]
}

type Options = {
  tsconfigPath: string
}

type TsType = TypeDescriptor<TSFunctionSignatureType>

export default class TypedocManager {
  private app: Application | undefined
  private options: Options
  private mappedReflectionSignatures: MappedReflectionSignature[]
  private project: ProjectReflection | undefined

  constructor(options: Options) {
    this.options = options
    this.mappedReflectionSignatures = []
  }

  async setup(filePath: string): Promise<ProjectReflection | undefined> {
    this.app = await Application.bootstrapWithPlugins({
      entryPoints: [filePath],
      tsconfig: this.options.tsconfigPath,
      plugin: ["typedoc-plugin-custom"],
      enableInternalResolve: true,
    })

    // This listener sets the content of mappedReflectionSignatures
    this.app.converter.on(
      Converter.EVENT_RESOLVE,
      (context: Context, reflection: Reflection) => {
        if (reflection instanceof DeclarationReflection) {
          if (reflection.sources?.length && reflection.signatures?.length) {
            this.mappedReflectionSignatures.push({
              source: reflection.sources[0],
              signatures: reflection.signatures,
            })
          }
        }
      }
    )

    this.project = await this.app.convert()

    return this.project
  }

  tryFillWithTypedocData(
    spec: Documentation,
    reflectionPathName: string[]
  ): Documentation {
    if (!this.project || !this.mappedReflectionSignatures || !spec.props) {
      return spec
    }
    // since the component may be a child of an exported component
    // we use the reflectionPathName to retrieve the component
    // by its "reflection path"
    const reflection = this.project?.getChildByName(
      reflectionPathName
    ) as DeclarationReflection
    if (!reflection) {
      return spec
    }

    const mappedSignature = reflection.sources?.length
      ? this.mappedReflectionSignatures.find(({ source }) => {
          return (
            source.fileName === reflection.sources![0].fileName &&
            source.line === reflection.sources![0].line &&
            source.character === reflection.sources![0].character
          )
        })
      : undefined

    if (
      mappedSignature?.signatures[0].parameters?.length &&
      mappedSignature.signatures[0].parameters[0].type
    ) {
      const props = getTypeChildren(
        mappedSignature.signatures[0].parameters[0].type,
        this.project
      )
      Object.entries(spec.props).forEach(([propName, propDetails]) => {
        const reflectionPropType = props.find(
          (propType) => propType.name === propName
        )
        if (reflectionPropType) {
          if (!propDetails.description && reflectionPropType.comment?.summary) {
            propDetails.description = reflectionPropType.comment.summary
              .map(({ text }) => text)
              .join(" ")
          }
          if (!propDetails.tsType && reflectionPropType.type) {
            propDetails.tsType = this.getTsType(reflectionPropType.type)
          }
        }
      })
    }

    return spec
  }

  getTsType(reflectionType: SomeType): TsType | undefined {
    const rawValue = getType({
      reflectionType,
      hideLink: true,
      wrapBackticks: false,
    })
    switch (reflectionType.type) {
      case "array": {
        const elements = this.getTsType(reflectionType.elementType)
        return {
          name: "Array",
          elements: elements ? [elements] : [],
          raw: rawValue,
        }
      }
      case "reference":
        const elements =
          reflectionType.reflection && "type" in reflectionType.reflection
            ? this.getTsType(reflectionType.reflection.type as SomeType)
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
                ? this.getTsType(parameter.type)
                : undefined
              typeData.signature.arguments.push({
                name: parameter.name,
                type: parameterType,
                rest: parameter.flags.isRest,
              })
            })

            typeData.signature.return = reflection.signatures[0].type
              ? this.getTsType(reflection.signatures[0].type)
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
                ? this.getTsType(property.type) || {
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
          elements: this.getElementsTypes(reflectionType.types),
        }
      case "tuple":
        return {
          name: "tuple",
          raw: rawValue,
          elements: this.getElementsTypes(reflectionType.elements),
        }
      default:
        return {
          name: rawValue,
        }
    }
  }

  getElementsTypes(elements: SomeType[]): TsType[] {
    const elementData: TsType[] = []

    elements.forEach((element) => {
      const tupleType = this.getTsType(element)
      if (tupleType) {
        elementData.push(tupleType)
      }
    })

    return elementData
  }
}
