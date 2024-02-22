import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { getHookParams } from "../../utils/react-query-utils"

export default function () {
  Handlebars.registerHelper(
    "reactQueryHookParams",
    function (this: SignatureReflection) {
      let parametersStr = ""
      const hookParameters = getHookParams(this)

      if (hookParameters?.length) {
        parametersStr = Handlebars.helpers.parameter.call(hookParameters, {
          hash: {
            sectionTitle: this.name,
          },
        })
      }

      return parametersStr
    }
  )
}
