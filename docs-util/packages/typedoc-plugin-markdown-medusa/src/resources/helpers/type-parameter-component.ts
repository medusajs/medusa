import * as Handlebars from "handlebars"
import { TypeParameterReflection } from "typedoc"
import { reflectionComponentFormatter } from "../../utils/reflection-formatter"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "typeParameterComponent",
    function (this: TypeParameterReflection[]) {
      const { parameterComponent } = theme.getFormattingOptionsForLocation()
      const parameters = this.map((parameter) =>
        reflectionComponentFormatter(parameter, 1)
      )

      return `<${parameterComponent} parameters={${JSON.stringify(
        parameters,
        null,
        2
      )}} />`
    }
  )
}
