import { MarkdownTheme } from "../../theme"
import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getStepOutputType } from "utils"
import { formatParameterComponent } from "../../utils/format-parameter-component"
import { getReflectionTypeParameters } from "../../utils/reflection-type-parameters"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "stepOutput",
    function (
      this: SignatureReflection,
      options: Handlebars.HelperOptions
    ): string {
      const { parameterComponent, maxLevel, parameterComponentExtraProps } =
        theme.getFormattingOptionsForLocation()

      const outputType = getStepOutputType(this)
      if (!outputType) {
        return ""
      }

      const output = getReflectionTypeParameters({
        reflectionType: outputType,
        project: this.project || options.data.theme.project,
        maxLevel,
      })

      if (!output.length) {
        return ""
      }

      const formattedComponent = formatParameterComponent({
        parameterComponent,
        componentItems: output,
        extraProps: parameterComponentExtraProps,
        sectionTitle: options.hash.sectionTitle,
      })

      return `${Handlebars.helpers.titleLevel()} Output\n\n${formattedComponent}`
    }
  )
}
