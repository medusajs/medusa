import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getQueryReturn } from "../../utils/react-query-utils"
import { MarkdownTheme } from "../../theme"
import { formatParameterComponent } from "../../utils/format-parameter-component"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "reactQueryQueryReturn",
    function (this: SignatureReflection) {
      const {
        parameterStyle,
        parameterComponent,
        maxLevel,
        parameterComponentExtraProps,
      } = theme.getFormattingOptionsForLocation()
      const mutationParameters = getQueryReturn({
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
