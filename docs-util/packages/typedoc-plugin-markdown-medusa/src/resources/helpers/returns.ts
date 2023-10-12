import * as Handlebars from "handlebars"
import { Comment, DeclarationReflection } from "typedoc"
import { MarkdownTheme } from "../../theme"
import reflectionFormatter from "../../utils/reflection-formatter"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("returns", function (comment: Comment) {
    const md: string[] = []
    const { parameterStyle, parameterComponent } =
      theme.getFormattingOptionsForLocation()

    if (comment.blockTags?.length) {
      const tags = comment.blockTags
        .filter((tag) => tag.tag === "@returns")
        .map((tag) => {
          let result = Handlebars.helpers.comment(tag.content)
          tag.content.forEach((commentPart) => {
            if (
              "target" in commentPart &&
              commentPart.target instanceof DeclarationReflection
            ) {
              const content = commentPart.target.children?.map((childItem) =>
                reflectionFormatter(childItem, parameterStyle, 1)
              )
              result +=
                parameterStyle === "component"
                  ? `\n\n<${parameterComponent} parameters={${JSON.stringify(
                      content
                    )}} title={"${commentPart.target.name}"} />\n\n`
                  : `\n\n<details>\n<summary>\n${
                      commentPart.target.name
                    }\n</summary>\n\n${content?.join("\n")}\n\n</details>`
            }
          })
          return result
        })
      md.push(tags.join("\n\n"))
    }

    return md.join("")
  })
}
