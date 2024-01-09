import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getMutationReturn } from "../../utils/react-query-utils"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifHasMutationReturn",
    function (this: SignatureReflection, options: Handlebars.HelperOptions) {
      return getMutationReturn({
        signatureReflection: this,
        project: theme.project || this.project,
        reflectionTypeGetterOptions: {
          // we only need to check if there are mutation returns,
          // so no need to get all the children
          maxLevel: 1,
        },
      }).length
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
