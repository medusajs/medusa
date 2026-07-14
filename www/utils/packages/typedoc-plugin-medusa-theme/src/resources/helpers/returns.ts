import Handlebars from "handlebars"
import { Comment, DeclarationReflection, SignatureReflection } from "typedoc"
import { MarkdownTheme } from "../../theme.js"
import reflectionFormatter from "../../utils/reflection-formatter.js"
import { getReflectionTypeParameters } from "../../utils/reflection-type-parameters.js"
import { Parameter } from "../../types.js"
import { formatParameterComponent } from "../../utils/format-parameter-component.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "returns",
    function (reflection: SignatureReflection) {
      let returnContent = ""
      if (reflection.variant === "signature" && "type" in reflection) {
        returnContent = getReturnFromType(theme, reflection)
      } else if (reflection.comment) {
        returnContent = getReturnFromComment(
          theme,
          reflection.comment,
          reflection.name
        )
      }

      if (!returnContent.length) {
        return ""
      }

      return `${Handlebars.helpers.titleLevel()} Returns\n\n${returnContent}`
    }
  )
}

function getReturnFromType(
  theme: MarkdownTheme,
  reflection: SignatureReflection
) {
  const {
    parameterStyle,
    parameterComponent,
    maxLevel,
    parameterComponentExtraProps,
  } = theme.getFormattingOptionsForLocation()

  if (!reflection.type) {
    return ""
  }

  const componentItems = getReflectionTypeParameters({
    reflectionType: reflection.type,
    project: reflection.project || theme.project,
    comment: reflection.comment,
    level: 1,
    maxLevel,
  })

  if (!componentItems.length) {
    return ""
  }

  if (parameterStyle === "component") {
    return formatParameterComponent({
      parameterComponent,
      componentItems,
      extraProps: parameterComponentExtraProps,
      sectionTitle: reflection.name,
    })
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

function getReturnFromComment(
  theme: MarkdownTheme,
  comment: Comment,
  reflectionName: string
) {
  const md: string[] = []
  const {
    parameterStyle,
    parameterComponent,
    maxLevel,
    parameterComponentExtraProps,
  } = theme.getFormattingOptionsForLocation()

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
                ? `\n\n${formatParameterComponent({
                    parameterComponent,
                    componentItems: content as Parameter[],
                    extraProps: {
                      ...parameterComponentExtraProps,
                      title: commentPart.target.name,
                    },
                    sectionTitle: reflectionName,
                  })}\n\n`
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
