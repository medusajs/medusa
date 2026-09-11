import Handlebars from "handlebars"
import { Reflection } from "typedoc"
import { MarkdownTheme } from "../../index.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifFeatureFlag",
    function (this: Reflection, options: Handlebars.HelperOptions) {
      const { sections } = theme.getFormattingOptionsForLocation()
      if (sections?.feature_flag === false) {
        return options.inverse(this)
      }
      return this.comment?.getTag("@featureFlag") !== undefined
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
