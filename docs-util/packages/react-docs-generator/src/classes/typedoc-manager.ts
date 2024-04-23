/* eslint-disable no-case-declarations */
import { Documentation } from "react-docgen"
import {
  FunctionSignatureType,
  ObjectSignatureType,
  TSFunctionSignatureType,
  TypeDescriptor,
} from "react-docgen/dist/Documentation.js"
import { Comment, ReferenceReflection, ReferenceType } from "typedoc"
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
import {
  getFunctionType,
  getProjectChild,
  getType,
  getTypeChildren,
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
      internalModule: "internal",
      checkVariables: true,
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
    let reflection = this.project?.getChildByName(reflectionPathName) as
      | DeclarationReflection
      | ReferenceReflection
    if (reflection && reflection instanceof ReferenceReflection) {
      // load declaration reflection
      reflection = reflection.getTargetReflection() as DeclarationReflection
    }
    if (!reflection) {
      return spec
    }

    const doesReflectionHaveSignature =
      reflection.type?.type === "reference" &&
      reflection.type.reflection instanceof DeclarationReflection &&
      reflection.type.reflection.signatures?.length

    // If the original reflection in the reference type has a signature
    // use that signature. Else, try to get the signature from the mapping.
    const signature = doesReflectionHaveSignature
      ? (
          (reflection.type! as ReferenceType)
            .reflection as DeclarationReflection
        ).signatures![0]
      : reflection.sources?.length
        ? this.getMappedSignatureFromSource(reflection.sources[0])
            ?.signatures[0]
        : undefined

    if (signature?.parameters?.length && signature.parameters[0].type) {
      // get the props of the component from the
      // first parameter in the signature.
      const props = getTypeChildren({
        reflectionType: signature.parameters![0].type!,
        project: this.project,
      })

      // this stores props that should be removed from the
      // spec
      const propsToRemove = new Set<string>()

      // loop over props in the spec to either add missing descriptions or
      // push a prop into the `propsToRemove` set.
      Object.entries(spec.props!).forEach(([propName, propDetails]) => {
        // retrieve the reflection of the prop
        const reflectionProp = props.find(
          (propType) => propType.name === propName
        )
        if (!reflectionProp) {
          // if the reflection doesn't exist and the
          // prop doesn't have a description, it should
          // be removed.
          if (!propDetails.description) {
            propsToRemove.add(propName)
          }
          return
        }
        // if the component has the `@excludeExternal` tag,
        // the prop is external, and it doesn't have the
        // `@keep` tag, the prop is removed.
        if (
          this.shouldExcludeExternal({
            parentReflection: reflection,
            childReflection: reflectionProp,
            propDescription: propDetails.description,
            signature,
          })
        ) {
          propsToRemove.add(propName)
          return
        }

        // if the prop doesn't have a default value, try to retrieve it
        if (!propDetails.defaultValue) {
          propDetails.defaultValue = this.getReflectionDefaultValue(
            reflectionProp,
            propDetails.description
          )
        }

        // if the prop doesn't have description, retrieve it using Typedoc
        propDetails.description =
          propDetails.description || this.getDescription(reflectionProp)
        // if the prop still doesn't have description, remove it.
        if (!propDetails.description) {
          propsToRemove.add(propName)
        } else {
          propDetails.description = this.normalizeDescription(
            propDetails.description
          )
        }
      })

      // delete props in the `propsToRemove` set from the specs.
      propsToRemove.forEach((prop) => delete spec.props![prop])

      // try to add missing props
      props
        .filter(
          (prop) =>
            // Filter out props that are already in the
            // specs, are already in the `propsToRemove` set
            // (meaning they've been removed), don't have a
            // comment, are React props, and are external props (if
            // the component excludes them).
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
          // If the prop has description (retrieved)
          // through Typedoc, it's added into the spec.
          const rawDescription = this.getDescription(prop)
          const description = this.normalizeDescription(rawDescription)
          if (!description) {
            return
          }
          spec.props![prop.name] = {
            description,
            required: !prop.flags.isOptional,
            defaultValue: this.getReflectionDefaultValue(prop, rawDescription),
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

  // Retrieves the `tsType` stored in a spec's prop
  // The format is based on the expected format of React Docgen.
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

  // Retrieves the TsType of nested elements. (Helpful for
  // Reflection types like `intersection` or `union`).
  getElementsTypes(elements: SomeType[], level = 1): TsType[] {
    const elementData: TsType[] = []

    elements.forEach((element) => {
      elementData.push(this.getTsType(element, level + 1))
    })

    return elementData
  }

  // Removes tags like `@keep` and `@ignore` from a
  // prop or component's description. These aren't removed
  // by React Docgen.
  normalizeDescription(description: string): string {
    let normalizedDescription = description
      .replace("@keep", "")
      .replace("@ignore", "")
      .replace("@excludeExternal", "")
      .trim()

    // check if `@defaultValue` tag is in the description and remove it
    const defaultValueIndex = normalizedDescription.indexOf("@defaultValue")
    if (defaultValueIndex !== -1) {
      // if there are tags after the default value, keep them and only
      // remove the default value.
      const possibleEndIndex = normalizedDescription.indexOf(
        "@",
        defaultValueIndex + "@defaultValue".length
      )
      normalizedDescription =
        normalizedDescription.slice(0, defaultValueIndex) +
        (possibleEndIndex === -1
          ? ""
          : normalizedDescription.slice(possibleEndIndex))
    }

    return normalizedDescription
  }

  // Retrieve the description of a reflection (component or prop)
  // through its summary.
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

  // Retrieves the TsType for a function
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

  // Checks if a TsType only has a `name` field.
  doesOnlyHaveName(obj: TsType): boolean {
    const primitiveTypes = ["string", "number", "object", "boolean", "function"]
    const keys = Object.keys(obj)

    return (
      keys.length === 1 &&
      keys[0] === "name" &&
      !primitiveTypes.includes(obj.name)
    )
  }

  // retrieves a reflection by the provided name
  // and check if its type is ReactNode
  // this is useful for the CustomResolver to check
  // if a variable is a React component.
  isReactComponent(name: string): boolean {
    const reflection = this.getReflectionByName(name, {
      hasSignature: true,
    })
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
        (signature.type.name === "ReactNode" ||
          (signature.type.name === "Element" &&
            signature.type.package === "@types/react"))
    )
  }

  // Returns the TsType of a child of a reflection.
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
      getTypeChildren({
        reflectionType: reflection.type,
        project: this.project,
      }).some((child) => {
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

  // Checks if a parent reflection has the `@excludeExternal`
  // which means external child reflections should be ignored.
  // external child reflections aren't ignored if they have the
  // `@keep` tag.
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

  // Gets comments of a reflection.
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

  // Gets a reflection by its name.
  getReflectionByName(
    name: string,
    options?: {
      hasSignature?: boolean
    }
  ): DeclarationReflection | undefined {
    return this.project
      ? (Object.values(this.project?.reflections || {}).find((ref) => {
          if (ref.name !== name) {
            return false
          }

          if (
            options?.hasSignature &&
            (!(ref instanceof DeclarationReflection) || !ref.signatures)
          ) {
            return false
          }

          return true
        }) as DeclarationReflection)
      : undefined
  }

  getReflectionDefaultValue(
    reflection: DeclarationReflection,
    description?: string
  ):
    | {
        value: string
        computed: boolean
      }
    | undefined {
    let value: string | undefined
    if (!reflection.defaultValue) {
      // try to infer default value from description
      const valueIndexInDescription = description
        ? description.indexOf("@defaultValue")
        : -1
      if (valueIndexInDescription !== -1) {
        const sliceStart = valueIndexInDescription + "@defaultValue ".length
        // the default value ends either at the end of the description or
        // until the next tag.
        const sliceEnd = description!.indexOf("@", sliceStart)
        value = description!.slice(
          sliceStart,
          sliceEnd !== -1 ? sliceEnd : undefined
        )
      }
    } else {
      value = JSON.stringify(reflection.defaultValue)
    }

    return value
      ? {
          value,
          computed: false,
        }
      : undefined
  }
}
