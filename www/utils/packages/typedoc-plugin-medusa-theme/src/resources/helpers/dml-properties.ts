import Handlebars from "handlebars"
import { DeclarationReflection } from "typedoc"
import { getDmlProperties, isDmlEntity } from "utils"

export default function () {
  Handlebars.registerHelper(
    "dmlProperties",
    function (this: DeclarationReflection) {
      if (!isDmlEntity(this) || this.type?.type !== "reference") {
        return ""
      }

      const properties = getDmlProperties(this.type)

      // TODO resolve the property types to names/native types
      return Handlebars.helpers.typeDeclarationMembers.call(properties, {
        hash: {
          sectionTitle: this.name,
        },
      })
    }
  )
}
