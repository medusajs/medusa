import * as Handlebars from "handlebars"
import { DeclarationReflection, ReferenceType } from "typedoc"
import { getDmlProperties, isDmlEntity } from "../../utils/dml-utils"

export default function () {
  Handlebars.registerHelper(
    "dmlProperties",
    function (this: DeclarationReflection) {
      if (!isDmlEntity(this)) {
        return ""
      }

      const properties = getDmlProperties(this.type as ReferenceType)

      // TODO resolve the property types to names/native types
      return Handlebars.helpers.typeDeclarationMembers.call(properties, {
        hash: {
          sectionTitle: this.name,
        },
      })
    }
  )
}
