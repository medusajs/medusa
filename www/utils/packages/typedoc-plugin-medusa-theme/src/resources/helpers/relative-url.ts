import Handlebars from "handlebars"

import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("relativeURL", function (url: string) {
    return url
      ? theme.publicPath
        ? theme.publicPath + url
        : theme.getRelativeUrl(url)
      : url
  })
}
