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
  CommentTag,
  Context,
  Converter,
  DeclarationReflection,
  ProjectReflection,
  Reflection,
  SignatureReflection,
  SomeType,
  SourceReference,
} from "typedoc"
import {
  getFunctionType,
  getProjectChild,
  getType,
  getTypeChildren,
  stripLineBreaks,
} from "utils"

type MappedReflectionSignature = {
  source: SourceReference
  signatures: SignatureReflection[]
}

type Options = {
  tsconfigPath: string
  disable?: boolean
  verbose?: boolean
}

type TsType = TypeDescriptor<TSFunctionSignatureType>

type MissingReactPropsOptions = {
  spec: Documentation
  comments: CommentTag[]
  exisitingProps: DeclarationReflection[]
}

export default class TypedocManager {
  private app: Application | undefined
  private options: Options
  private mappedReflectionSignatures: MappedReflectionSignature[]
  private project: ProjectReflection | undefined
  private getTypeOptions = {
    hideLink: true,
    wrapBackticks: false,
    escape: false,
  }

  constructor(options: Options) {
    this.options = options
    this.mappedReflectionSignatures = []
  }

  async setup(filePath: string): Promise<ProjectReflection | undefined> {
    if (this.options.disable) {
      return
    }
    this.app = await Application.bootstrapWithPlugins({
      entryPoints: [filePath],
      tsconfig: this.options.tsconfigPath,
      plugin: ["typedoc-plugin-custom"],
      enableInternalResolve: true,
      logLevel: this.options.verbose ? "Verbose" : "None",
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
    if (!this.isProjectSetUp()) {
      return spec
    }
    if (!spec.props) {
      spec.props = {}
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
      ? this.getMappedSignatureFromSource(reflection.sources[0])
      : undefined

    if (
      mappedSignature?.signatures[0].parameters?.length &&
      mappedSignature.signatures[0].parameters[0].type
    ) {
      const signature = mappedSignature.signatures[0]
      const props = getTypeChildren(
        signature.parameters![0].type!,
        this.project
      )

      if (signature.comment) {
        // add missing props to the spec if they're included in the `@showReactProp` tag
        // of the signature.
        spec = this.addMissingReactProps({
          spec,
          comments: signature.comment.blockTags,
          exisitingProps: props,
        })
      }

      Object.entries(spec.props!).forEach(([propName, propDetails]) => {
        const reflectionPropType = props.find(
          (propType) => propType.name === propName
        )
        if (reflectionPropType) {
          if (!propDetails.description) {
            propDetails.description =
              this.getDescription(reflectionPropType) || propDetails.description
          }
          if (!propDetails.tsType) {
            propDetails.tsType = reflectionPropType.type
              ? this.getTsType(reflectionPropType.type)
              : reflectionPropType.signatures?.length
                ? this.getFunctionTsType(reflectionPropType.signatures[0])
                : undefined

            if (!propDetails.tsType) {
              delete propDetails.tsType
            }
          }
        }
      })
    }

    // remove `@showReactProp` tag from the spec's description
    // if any
    spec.description = stripLineBreaks(
      spec.description?.replaceAll(/@showReactProp .*/g, "") || ""
    )

    return spec
  }

  isProjectSetUp() {
    return this.project && this.mappedReflectionSignatures
  }

  getMappedSignatureFromSource(
    origSource: SourceReference
  ): MappedReflectionSignature | undefined {
    return this.mappedReflectionSignatures.find(({ source }) => {
      return (
        source.fileName === origSource.fileName &&
        source.line === origSource.line &&
        source.character === origSource.character
      )
    })
  }

  addMissingReactProps({
    spec,
    comments,
    exisitingProps,
  }: MissingReactPropsOptions) {
    comments
      .filter((tag) => tag.tag === `@showReactProp`)
      .map((tag) => tag.content.map(({ text }) => text).join())
      .forEach((propName) => {
        const reflectionProp = exisitingProps.find(
          (prop) => prop.name === propName
        )
        if (!Object.hasOwn(spec.props!, propName) && reflectionProp) {
          spec.props![propName] = {
            required: !reflectionProp.flags.isOptional,
          }
        }
      })

    return spec
  }

  getTsType(reflectionType: SomeType): TsType {
    const rawValue = getType({
      reflectionType,
      ...this.getTypeOptions,
    })
    switch (reflectionType.type) {
      case "array": {
        const elements = this.getTsType(reflectionType.elementType)
        return {
          name: "Array",
          elements: [elements],
          raw: rawValue,
        }
      }
      case "reference":
        const referenceReflection: DeclarationReflection | undefined =
          (reflectionType.reflection as DeclarationReflection) ||
          getProjectChild(this.project!, reflectionType.name)
        const elements: TsType[] = []
        if (referenceReflection?.children) {
          referenceReflection.children?.forEach((child) => {
            if (!child.type) {
              return
            }

            elements.push(this.getTsType(child.type))
          })
        } else if (referenceReflection?.type) {
          elements.push(this.getTsType(referenceReflection.type))
        }
        return {
          name: reflectionType.name,
          elements: elements,
          raw: rawValue,
        }
      case "reflection":
        const reflection = reflectionType.declaration
        if (reflection.signatures?.length) {
          return this.getFunctionTsType(reflection.signatures[0], rawValue)
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
                ? this.getTsType(property.type)
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
      elementData.push(this.getTsType(element))
    })

    return elementData
  }

  getDescription(reflection: DeclarationReflection): string {
    let commentDisplay = reflection.comment?.summary
    if (!commentDisplay) {
      const signature = reflection.signatures?.find(
        (sig) => sig.comment?.summary.length
      )
      if (signature) {
        commentDisplay = signature.comment!.summary
      }
    }

    return commentDisplay?.map(({ text }) => text).join("") || ""
  }

  getFunctionTsType(signature: SignatureReflection, rawValue?: string): TsType {
    if (!rawValue) {
      rawValue = getFunctionType({
        modelSignatures: [signature],
        ...this.getTypeOptions,
      })
    }
    const typeData: FunctionSignatureType = {
      name: "signature",
      type: "function",
      raw: rawValue,
      signature: {
        arguments: [],
        return: undefined,
      },
    }

    signature.parameters?.forEach((parameter) => {
      const parameterType = parameter.type
        ? this.getTsType(parameter.type)
        : undefined
      typeData.signature.arguments.push({
        name: parameter.name,
        type: parameterType,
        rest: parameter.flags.isRest,
      })
    })

    typeData.signature.return = signature.type
      ? this.getTsType(signature.type)
      : undefined

    return typeData
  }
}
