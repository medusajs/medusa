import * as Handlebars from "handlebars"
import { ReflectionParameterType } from "../../types"
import { parseParams } from "../../utils/params-utils"
import { MarkdownTheme } from "../../theme"
import { reflectionComponentFormatter } from "../../utils/reflection-formatter"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "parameterComponent",
    function (this: ReflectionParameterType[]) {
      const { parameterComponent, maxLevel } =
        theme.getFormattingOptionsForLocation()
      const parameters = this.reduce(
        (acc: ReflectionParameterType[], current) => parseParams(current, acc),
        []
      ).map((parameter) => reflectionComponentFormatter(parameter, 1, maxLevel))

      return `<${parameterComponent} parameters={${JSON.stringify(
        parameters,
        null,
        2
      )}} />`
    }
  )
}
