import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getMutationReturn } from "../../utils/react-query-utils.js"
import { MarkdownTheme } from "../../theme.js"
import { formatParameterComponent } from "../../utils/format-parameter-component.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "reactQueryMutationReturn",
    function (this: SignatureReflection) {
      const {
        parameterStyle,
        parameterComponent,
        maxLevel,
        parameterComponentExtraProps,
      } = theme.getFormattingOptionsForLocation()
      const mutationParameters = getMutationReturn({
        signatureReflection: this,
        project: theme.project || this.project,
        reflectionTypeGetterOptions: {
          maxLevel,
        },
      })

      if (parameterStyle !== "component") {
        // TODO maybe handle other cases? But for now it's not important
        return ""
      }

      return formatParameterComponent({
        parameterComponent,
        componentItems: mutationParameters,
        extraProps: parameterComponentExtraProps,
        sectionTitle: this.name,
      })
    }
  )
}
