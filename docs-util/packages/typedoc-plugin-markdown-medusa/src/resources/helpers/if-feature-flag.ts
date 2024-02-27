import * as Handlebars from "handlebars"
import { Reflection } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "ifFeatureFlag",
    function (this: Reflection, options: Handlebars.HelperOptions) {
      return this.comment?.getTag("@featureFlag") !== undefined
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
