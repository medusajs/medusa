import * as Handlebars from "handlebars"
import { Comment, DeclarationReflection } from "typedoc"
import reflectionFomatter from "../../utils/reflection-formatter"

export default function () {
  Handlebars.registerHelper("returns", function (comment: Comment) {
    const md: string[] = []

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
                reflectionFomatter(childItem)
              )
              result += `\n\n<details>\n<summary>\n${
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
