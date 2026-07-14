import Handlebars from "handlebars"
import { escapeChars } from "utils"

export default function () {
  Handlebars.registerHelper("escape", function (str: string) {
    return escapeChars(str)
  })
}
