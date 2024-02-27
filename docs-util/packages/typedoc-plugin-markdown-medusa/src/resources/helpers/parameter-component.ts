import * as Handlebars from "handlebars"
import { ReflectionParameterType } from "../../types"
import { parseParams } from "../../utils/params-utils"
import { MarkdownTheme } from "../../theme"
import { reflectionComponentFormatter } from "../../utils/reflection-formatter"
import { formatParameterComponent } from "../../utils/format-parameter-component"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "parameterComponent",
    function (
      this: ReflectionParameterType[],
      options: Handlebars.HelperOptions
    ) {
      const { parameterComponent, maxLevel, parameterComponentExtraProps } =
        theme.getFormattingOptionsForLocation()
      const parameters = this.reduce(
        (acc: ReflectionParameterType[], current) => parseParams(current, acc),
        []
      ).map((parameter) =>
        reflectionComponentFormatter({
          reflection: parameter,
          level: 1,
          maxLevel,
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
