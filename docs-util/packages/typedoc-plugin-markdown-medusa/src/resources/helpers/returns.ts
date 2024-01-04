import * as Handlebars from "handlebars"
import { Comment, DeclarationReflection, SignatureReflection } from "typedoc"
import { MarkdownTheme } from "../../theme"
import reflectionFormatter from "../../utils/reflection-formatter"
import { returnReflectionComponentFormatter } from "../../utils/return-reflection-formatter"
import { Parameter } from "../../types"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "returns",
    function (reflection: SignatureReflection) {
      if (reflection.variant === "signature" && "type" in reflection) {
        return getReturnFromType(theme, reflection)
      } else if (reflection.comment) {
        return getReturnFromComment(theme, reflection.comment)
      } else {
        return ""
      }
    }
  )
}

function getReturnFromType(
  theme: MarkdownTheme,
  reflection: SignatureReflection
) {
  const { parameterStyle, parameterComponent, maxLevel } =
    theme.getFormattingOptionsForLocation()

  if (!reflection.type) {
    return ""
  }

  const componentItems = returnReflectionComponentFormatter({
    reflectionType: reflection.type,
    project: reflection.project || theme.project,
    comment: reflection.comment,
    level: 1,
    maxLevel,
  })

  if (parameterStyle === "component") {
    return `<${parameterComponent} parameters={${JSON.stringify(
      componentItems,
      null,
      2
    )}} />`
  } else {
    return formatReturnAsList(componentItems)
  }
}

function formatReturnAsList(componentItems: Parameter[], level = 1): string {
  const prefix = `${Array(level - 1)
    .fill("\t")
    .join("")}-`
  return componentItems
    .map(
      (item) =>
        `${prefix}\`${item.name}\`: ${
          item.optional || item.defaultValue
            ? `(${item.optional ? "optional" : ""}${
                item.optional && item.defaultValue ? "," : ""
              }${item.defaultValue ? `default: ${item.defaultValue}` : ""}) `
            : ""
        }${item.description}${
          item.children?.length
            ? `\n${formatReturnAsList(item.children, level + 1)}`
            : ""
        }`
    )
    .join("\n")
}

function getReturnFromComment(theme: MarkdownTheme, comment: Comment) {
  const md: string[] = []
  const { parameterStyle, parameterComponent, maxLevel } =
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
              reflectionFormatter({
                reflection: childItem,
                type: parameterStyle,
                level: 1,
                maxLevel,
              })
            )
            result +=
              parameterStyle === "component"
                ? `\n\n<${parameterComponent} parameters={${JSON.stringify(
                    content,
                    null,
                    2
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
}
