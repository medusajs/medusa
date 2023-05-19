import {
  Application,
  Comment,
  Context,
  Converter,
  ParameterType,
  Reflection,
  ReflectionKind,
} from "typedoc"

type ReferenceTypeOptions = {
  referenceTypes?: string[]
  reflectionKinds?: ReflectionKind[]
}

export class ReferenceTypePlugin {
  protected options: ReferenceTypeOptions = {}

  initialize(app: Application) {
    this.defineOptions(app)

    app.converter.on(Converter.EVENT_BEGIN, () => this.initializeOptions(app))

    app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
      context.project.traverse((reflection) => {
        if (!this.checkReflection(reflection, context)) {
          context.project.removeReflection(reflection)
        }
      })
    })
  }

  initializeOptions(app: Application) {
    this.options.referenceTypes = app.options.getValue(
      "referenceTypes"
    ) as string[]
    this.options.reflectionKinds = (
      app.options.getValue("reflectionKinds") as string[]
    ).map((r) => Number(r))
  }

  defineOptions(app: Application) {
    app.options.addDeclaration({
      name: "referenceTypes",
      help: "The reference types to include in the reference",
      type: ParameterType.Array,
      defaultValue: [],
      validate: (value: string[]) => {
        if (!Array.isArray(value)) {
          throw new Error("referenceType should be an array")
        }
      },
    })

    app.options.addDeclaration({
      name: "reflectionKinds",
      help: "The reflection kinds to include in the reference",
      type: ParameterType.Array,
      defaultValue: [],
      validate: (value: string[]) => {
        if (!Array.isArray(value)) {
          throw new Error("reflectionKind should be an array")
        }

        value.map((v) => {
          if (!(Number(v) in ReflectionKind)) {
            throw new Error(`reflectionKind ${v} does not exist in Typedoc`)
          }
        })
      },
    })
  }

  isAllowed(reflection: Reflection): boolean {
    return (
      this.isAllowedReferenceType(reflection.comment) ||
      this.isAllowedReflectionKind(reflection)
    )
  }

  isAllowedReferenceType(comment?: Comment): boolean {
    if (!comment) {
      return false
    }

    return (
      this.options.referenceTypes?.some((type) =>
        comment.blockTags.some(
          (tag) =>
            tag.tag === `@referenceType` &&
            tag.content.some((c) => c.text === type)
        )
      ) || false
    )
  }

  isAllowedReflectionKind(reflection: Reflection): boolean {
    return (
      this.options.reflectionKinds?.some((kind) => reflection.kindOf(kind)) ||
      false
    )
  }

  checkReflection(reflection: Reflection, context: Context): boolean {
    let isReflectionAllowed = this.isAllowed(reflection)
    if (!isReflectionAllowed) {
      reflection.traverse((ref) => {
        const childAllowed = this.checkReflection(ref, context)
        if (!childAllowed) {
          context.project.removeReflection(ref)
        }
        if (!isReflectionAllowed) {
          isReflectionAllowed = this.isAllowed(ref) || childAllowed
        }
      })
    }

    return isReflectionAllowed
  }
}
