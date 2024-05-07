import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReflectionKind,
} from "typedoc"

export function load(app: Application) {
  app.options.addDeclaration({
    name: "parentIgnore",
    help: "Whether to ignore items with the `@parentIgnore` tag.",
    type: ParameterType.Boolean, // The default
    defaultValue: false,
  })

  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
    const isParentIgnoreEnabled = app.options.getValue("parentIgnore")
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      if (
        isParentIgnoreEnabled &&
        reflection instanceof DeclarationReflection
      ) {
        reflection.comment?.blockTags
          .filter((tag) => tag.tag === "@parentIgnore")
          .forEach((tag) => {
            const fieldNames = tag.content
              .map((content) => content.text)
              .join("")
              .split(",")
            reflection.children = reflection.children?.filter(
              (child) => !fieldNames.includes(child.name)
            )
          })
      }

      if (reflection.comment) {
        reflection.comment.blockTags = reflection.comment?.blockTags.filter(
          (tag) => tag.tag !== "@parentIgnore"
        )
      }
    }
  })
}
