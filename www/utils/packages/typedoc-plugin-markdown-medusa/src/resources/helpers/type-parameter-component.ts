import * as Handlebars from "handlebars"
import { TypeParameterReflection } from "typedoc"
import { reflectionComponentFormatter } from "../../utils/reflection-formatter"
import { MarkdownTheme } from "../../theme"
import { formatParameterComponent } from "../../utils/format-parameter-component"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "typeParameterComponent",
    function (
      this: TypeParameterReflection[],
      options: Handlebars.HelperOptions
    ) {
      const { parameterComponent, maxLevel, parameterComponentExtraProps } =
        theme.getFormattingOptionsForLocation()
      const parameters = this.map((parameter) =>
        reflectionComponentFormatter({
          reflection: parameter,
          level: 1,
          maxLevel,
          isTypeParams: true,
        })
      )

      return formatParameterComponent({
        parameterComponent,
        componentItems: parameters,
        extraProps: parameterComponentExtraProps,
        sectionTitle: options.hash.sectionTitle,
      })
    }
  )
}
