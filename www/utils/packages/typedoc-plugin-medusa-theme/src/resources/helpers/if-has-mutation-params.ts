import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getMutationParams } from "../../utils/react-query-utils.js"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifHasMutationParams",
    function (this: SignatureReflection, options: Handlebars.HelperOptions) {
      return getMutationParams({
        signatureReflection: this,
        project: theme.project || this.project,
        reflectionTypeGetterOptions: {
          // we only need to check if there are mutation parameters,
          // so no need to get all the children
          maxLevel: 1,
        },
      }).length
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
