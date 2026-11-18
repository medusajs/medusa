import Handlebars from "handlebars"
import { Reflection } from "typedoc"
import { getReflectionAnchor, reflectionHasOwnDocument } from "utils"

export default function () {
  Handlebars.registerHelper("reflectionAnchor", function (this: Reflection) {
    return getReflectionAnchor(this)
  })
  Handlebars.registerHelper(
    "reflectionHasOwnDocument",
    function (this: Reflection) {
      return reflectionHasOwnDocument(this)
    }
  )
}
