import { ESLint } from "eslint"
import {
  Application,
  Context,
  Converter,
  ParameterType,
  ReflectionKind,
} from "typedoc"

export function load(app: Application) {
  app.options.addDeclaration({
    name: "eslintPathName",
    help: "The path to the ESLint configurations to apply.",
    type: ParameterType.String,
  })
  app.options.addDeclaration({
    name: "pluginsResolvePath",
    help: "The path to resolve plugins used in the ESLint configurations.",
    type: ParameterType.String,
  })
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, async (context: Context) => {
    const eslintConfigPath = app.options.getValue("eslintPathName") as string
    const pluginsResolvePath = app.options.getValue(
      "pluginsResolvePath"
    ) as string
    if (!eslintConfigPath) {
      return
    }
    const eslint = new ESLint({
      overrideConfigFile: eslintConfigPath,
      resolvePluginsRelativeTo: pluginsResolvePath,
      fix: true,
    })
    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.All
    )) {
      const example = reflection.comment?.getTag(`@example`)
      if (example) {
        await Promise.all(
          example.content
            .filter((exampleContent) => exampleContent.kind === "code")
            .map(async (exampleContent) => {
              const matchedCodeSnippets = exampleContent.text.matchAll(
                /```ts(?<code>[\s\S.]*)```/g
              )
              for (const matchedCodeSnippet of matchedCodeSnippets) {
                if (!matchedCodeSnippet.groups?.code) {
                  return
                }

                const result = await eslint.lintText(
                  matchedCodeSnippet.groups.code
                )

                exampleContent.text =
                  result.length > 0 && result[0].output
                    ? "```ts\n" + result[0].output + "```"
                    : exampleContent.text
              }
            })
        )
      }
    }
  })
}
