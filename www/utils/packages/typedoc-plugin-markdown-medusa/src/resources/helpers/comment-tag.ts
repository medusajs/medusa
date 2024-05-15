import * as Handlebars from "handlebars"
import { CommentTag } from "typedoc"
import { camelToTitleCase } from "../../utils"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "commentTag",
    function (tag: CommentTag, parent = null) {
      const { showCommentsAsHeader, showCommentsAsDetails } =
        theme.getFormattingOptionsForLocation()
      if (tag.tag === "@schema") {
        tag.content.forEach((content, index) => {
          tag.content[index].text = getDescriptionFromSchema(content.text)
        })
      }
      const tagTitle = camelToTitleCase(tag.tag.substring(1)),
        tagContent = Handlebars.helpers.comment(tag.content)

      if (showCommentsAsHeader) {
        return `${Handlebars.helpers.titleLevel.call(
          parent
        )} ${tagTitle}\n\n${tagContent}`
      } else if (showCommentsAsDetails) {
        return `<details>\n<summary>\n${tagTitle}\n</summary>\n\n${tagContent}\n\n</details>`
      }

      return `**${tagTitle}**\n\n${tagContent}`
    }
  )

  function getDescriptionFromSchema(content: string) {
    const regex = new RegExp(/description: "(?<description>.*)"/)

    const matchDescription = content.match(regex)

    return matchDescription?.groups?.description || content
  }
}
