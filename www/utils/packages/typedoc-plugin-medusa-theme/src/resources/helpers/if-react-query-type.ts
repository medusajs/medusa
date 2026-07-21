import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import {
  isReactQueryMutation,
  isReactQueryQuery,
} from "../../utils/react-query-utils.js"

export default function () {
  Handlebars.registerHelper(
    "ifReactQueryType",
    function (this: SignatureReflection, options: Handlebars.HelperOptions) {
      return isReactQueryMutation(this) || isReactQueryQuery(this)
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
