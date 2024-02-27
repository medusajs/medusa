import * as Handlebars from "handlebars"
import { ReflectionGroup } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "ifCanShowConstructorTitle",
    function (this: ReflectionGroup, options: Handlebars.HelperOptions) {
      return this.title.toLowerCase() !== "constructors" ||
        this.children.length > 1
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
