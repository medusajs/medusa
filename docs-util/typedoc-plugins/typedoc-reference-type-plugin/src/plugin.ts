import { Application, Comment, Context, Converter, ParameterType, ReflectionKind } from "typedoc"

type ReferenceTypeOptions = {
  types?: string[]
}

export class ReferenceTypePlugin {
  protected options: ReferenceTypeOptions = {}

  initialize (app: Application) {
    app.options.addDeclaration({
      name: "referenceType",
      help: "The main type to include in the reference",
      type: ParameterType.Array, // The default
      defaultValue: [],
      validate: (value: any) => {
        if (
          !Array.isArray(value)
        ) {
          throw new Error("referenceType should be an array")
        }
      },
    })

    app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
      this.options.types = app.options.getValue('referenceType') as string[]
      const reflections = context.project.getReflectionsByKind(ReflectionKind.All)
      reflections.map((reflection) => {
        // we can't document anything without documenting the project and class
        // so we have to always allow it
        if(reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Project) {
          return
        }
        const allowed = this.isAllowed(reflection.comment)
        // console.log(allowed)
        if (!allowed) {
          // app.converter.shouldIgnore(reflection.)
          context.project.removeReflection(reflection)
        }
      })

      // console.log(context.project.reflections)
    });
  }

  isAllowed (comment?: Comment): boolean {
    if (!comment) {
      return false
    }
    
    return this.options.types?.some((type) => {
      console.log(comment.blockTags)
      return comment.summary.some((sum) => {
         sum.kind === 'inline-tag' && sum.tag === '@referenceType' && sum.text === type
      })
    }) || false
  }
}