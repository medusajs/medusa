/* eslint-disable no-case-declarations */
import { Documentation } from "react-docgen"
import {
  FunctionSignatureType,
  ObjectSignatureType,
  TSFunctionSignatureType,
  TypeDescriptor,
} from "react-docgen/dist/Documentation.js"
import { Comment } from "typedoc"
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
  // stripLineBreaks,
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

type ExcludeExternalOptions = {
  parentReflection: DeclarationReflection
  childReflection: DeclarationReflection
  signature?: SignatureReflection
  propDescription?: string
}

const MAX_LEVEL = 3

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

      // if (signature.comment) {
      //   // add missing props to the spec if they're included in the `@showReactProp` tag
      //   // of the signature.
      //   spec = this.addMissingReactProps({
      //     spec,
      //     comments: signature.comment.blockTags,
      //     exisitingProps: props,
      //   })
      // }

      const propsToRemove = new Set<string>()

      Object.entries(spec.props!).forEach(([propName, propDetails]) => {
        const reflectionPropType = props.find(
          (propType) => propType.name === propName
        )
        if (!reflectionPropType) {
          if (!propDetails.description) {
            propsToRemove.add(propName)
          }
          return
        }
        if (
          this.shouldExcludeExternal({
            parentReflection: reflection,
            childReflection: reflectionPropType,
            propDescription: propDetails.description,
            signature,
          })
        ) {
          propsToRemove.add(propName)
          return
        }
        propDetails.description =
          propDetails.description || this.getDescription(reflectionPropType)
        if (!propDetails.description) {
          propsToRemove.add(propName)
        } else {
          propDetails.description = this.normalizeDescription(
            propDetails.description
          )
        }
        // if (reflectionPropType) {
        // tsType is set/replaced if the spec doesn't have it
        // or if it just has a name of a reflection.
        // TODO remove
        //   const shouldReplaceTsType =
        //     !propDetails.tsType ||
        //     (this.doesOnlyHaveName(propDetails.tsType) &&
        //       reflectionPropType.type?.type === "reference")
        //   if (shouldReplaceTsType) {
        //     propDetails.tsType = reflectionPropType.type
        //       ? this.getTsType(reflectionPropType.type)
        //       : reflectionPropType.signatures?.length
        //         ? this.getFunctionTsType(reflectionPropType.signatures[0])
        //         : undefined
        //     if (!propDetails.tsType) {
        //       delete propDetails.tsType
        //     }
        //   }
        // }
      })

      propsToRemove.forEach((prop) => delete spec.props![prop])

      // try to add missing props
      props
        .filter(
          (prop) =>
            !Object.hasOwn(spec.props!, prop.name) &&
            !propsToRemove.has(prop.name) &&
            this.getReflectionComment(prop) &&
            !this.isFromReact(prop) &&
            !this.shouldExcludeExternal({
              parentReflection: reflection,
              childReflection: prop,
              signature,
            })
        )
        .forEach((prop) => {
          const description = this.normalizeDescription(
            this.getDescription(prop)
          )
          if (!description) {
            return
          }
          spec.props![prop.name] = {
            description: this.normalizeDescription(this.getDescription(prop)),
            required: !prop.flags.isOptional,
            tsType: prop.type
              ? this.getTsType(prop.type)
              : prop.signatures?.length
                ? this.getFunctionTsType(prop.signatures[0])
                : undefined,
          }

          if (!spec.props![prop.name].tsType) {
            delete spec.props![prop.name].tsType
          }
        })
    }

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
      .filter((tag) => tag.tag === `@prop` && tag.name !== undefined)
      .map((tag) => tag.name)
      .forEach((propName) => {
        const reflectionProp = exisitingProps.find(
          (prop) => prop.name === propName
        )
        if (!Object.hasOwn(spec.props!, propName!) && reflectionProp) {
          spec.props![propName!] = {
            required: !reflectionProp.flags.isOptional,
          }
        }
      })

    return spec
  }

  getTsType(reflectionType: SomeType, level = 1): TsType {
    const rawValue = getType({
      reflectionType,
      ...this.getTypeOptions,
    })
    if (level > MAX_LEVEL) {
      return {
        name: rawValue,
      }
    }
    switch (reflectionType.type) {
      case "array": {
        const elements = this.getTsType(reflectionType.elementType, level + 1)
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

            elements.push(this.getTsType(child.type, level + 1))
          })
        } else if (referenceReflection?.type) {
          elements.push(this.getTsType(referenceReflection.type, level + 1))
        }
        return {
          name: reflectionType.name,
          elements: elements,
          raw: rawValue,
        }
      case "reflection":
        const reflection = reflectionType.declaration
        if (reflection.signatures?.length) {
          return this.getFunctionTsType(
            reflection.signatures[0],
            rawValue,
            level + 1
          )
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
                ? this.getTsType(property.type, level + 1)
                : {
                    name: "unknown",
                  },
              description: this.getDescription(property),
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
          elements: this.getElementsTypes(reflectionType.types, level),
        }
      case "tuple":
        return {
          name: "tuple",
          raw: rawValue,
          elements: this.getElementsTypes(reflectionType.elements, level),
        }
      default:
        return {
          name: rawValue,
        }
    }
  }

  getElementsTypes(elements: SomeType[], level = 1): TsType[] {
    const elementData: TsType[] = []

    elements.forEach((element) => {
      elementData.push(this.getTsType(element, level + 1))
    })

    return elementData
  }

  normalizeDescription(description: string): string {
    return stripLineBreaks(
      description
        .replace("@keep", "")
        .replace("@ignore", "")
        .replace("@excludeExternal", "")
    )
  }

  getDescription(reflection: DeclarationReflection): string {
    let commentDisplay = this.getReflectionComment(reflection)?.summary
    if (!commentDisplay) {
      const signature = reflection.signatures?.find(
        (sig) => this.getReflectionComment(sig)?.summary.length
      )
      if (signature) {
        commentDisplay = this.getReflectionComment(signature)!.summary
      }
    }

    return commentDisplay?.map(({ text }) => text).join("") || ""
  }

  getFunctionTsType(
    signature: SignatureReflection,
    rawValue?: string,
    level = 1
  ): TsType {
    if (!rawValue) {
      rawValue = getFunctionType({
        modelSignatures: [signature],
        ...this.getTypeOptions,
      })
    }
    const typeData: FunctionSignatureType = {
      name: "signature",
      type: "function",
      raw: rawValue!,
      signature: {
        arguments: [],
        return: undefined,
      },
    }

    signature.parameters?.forEach((parameter) => {
      const parameterType = parameter.type
        ? this.getTsType(parameter.type, level + 1)
        : undefined
      typeData.signature.arguments.push({
        name: parameter.name,
        type: parameterType,
        rest: parameter.flags.isRest,
      })
    })

    typeData.signature.return = signature.type
      ? this.getTsType(signature.type, level + 1)
      : undefined

    return typeData
  }

  doesOnlyHaveName(obj: TsType): boolean {
    const keys = Object.keys(obj)

    return keys.length === 1 && keys[0] === "name"
  }

  // retrieves a reflection by the provided name
  // and check if its type is ReactNode
  // this is useful for the CustomResolver to check
  // if a variable is a React component.
  isReactComponent(name: string): boolean {
    const reflection = this.getReflectionByName(name)

    if (
      !reflection ||
      !(reflection instanceof DeclarationReflection) ||
      !reflection.signatures
    ) {
      return false
    }

    return reflection.signatures.some(
      (signature) =>
        signature.type?.type === "reference" &&
        signature.type.name === "ReactNode"
    )
  }

  resolveChildType(reflectionName: string, childName: string): TsType | null {
    if (!this.project) {
      return null
    }

    const reflection = this.getReflectionByName(reflectionName)

    if (!reflection) {
      return null
    }

    let childReflection: DeclarationReflection | undefined

    if (reflection.children) {
      childReflection = reflection.getChildByName(
        childName
      ) as DeclarationReflection
    } else if (reflection.type) {
      getTypeChildren(reflection.type, this.project).some((child) => {
        if (child.name === childName) {
          childReflection = child
          return true
        }

        return false
      })
    }

    if (
      !childReflection ||
      !("type" in childReflection) ||
      (this.isFromReact(childReflection as DeclarationReflection) &&
        !this.getReflectionComment(childReflection)?.summary)
    ) {
      return null
    }

    return this.getTsType(childReflection.type as SomeType)
  }

  // used to check if a reflection (typically of a prop)
  // is inherited from React (for example, the className prop)
  isFromReact(reflection: DeclarationReflection) {
    // check first if the reflection has the `@keep` modifier
    if (this.getReflectionComment(reflection)?.hasModifier("@keep")) {
      return false
    }
    return reflection.sources?.some((source) =>
      source.fileName.includes("@types/react")
    )
  }

  shouldExcludeExternal({
    parentReflection,
    childReflection,
    propDescription,
    signature,
  }: ExcludeExternalOptions): boolean {
    const parentHasExcludeExternalsModifier =
      this.getReflectionComment(parentReflection)?.hasModifier(
        "@excludeExternal"
      ) ||
      (signature &&
        this.getReflectionComment(signature)?.hasModifier(
          "@excludeExternal"
        )) ||
      false
    const childHasKeepModifier =
      this.getReflectionComment(childReflection)?.hasModifier("@keep") ||
      propDescription?.includes("@keep")
    const childHasExternalSource =
      childReflection.sources?.some((source) =>
        source.fileName.startsWith("node_modules")
      ) || false
    return (
      parentHasExcludeExternalsModifier &&
      !childHasKeepModifier &&
      childHasExternalSource
    )
  }

  getReflectionComment(reflection: Reflection): Comment | undefined {
    if (reflection.comment) {
      return reflection.comment
    }

    if (
      reflection instanceof DeclarationReflection &&
      reflection.signatures?.length
    ) {
      return reflection.signatures.find(
        (signature) => signature.comment !== undefined
      )?.comment
    }

    return undefined
  }

  getReflectionByName(name: string): DeclarationReflection | undefined {
    return this.project
      ? (Object.values(this.project?.reflections || {}).find(
          (ref) => ref.name === name
        ) as DeclarationReflection)
      : undefined
  }
}
