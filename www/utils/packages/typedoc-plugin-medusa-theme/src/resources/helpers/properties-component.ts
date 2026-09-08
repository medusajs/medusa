import Handlebars from "handlebars"
import { DeclarationReference } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "propertiesComponent",
    function (this: DeclarationReference) {
      console.log(this)
    }
  )
}
