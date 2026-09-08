import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "indexSignatureTitle",
    function (this: SignatureReflection) {
      const md = ["▪"]
      const parameters = this.parameters
        ? this.parameters.map((parameter) => {
            return `${parameter.name}: ${Handlebars.helpers.type.call(
              parameter.type
            )}`
          })
        : []
      md.push(
        `[${parameters.join("")}]: ${Handlebars.helpers.type.call(this.type)}`
      )
      return md.join(" ")
    }
  )
}
