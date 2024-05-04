import * as Handlebars from "handlebars"
import { ReferenceReflection } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "referenceMember",
    function (this: ReferenceReflection) {
      const referenced = this.tryGetTargetReflectionDeep()

      if (!referenced) {
        return `Re-exports ${this.name}`
      }

      if (this.name === referenced.name) {
        return `Re-exports [${
          referenced.name
        }](${Handlebars.helpers.relativeURL(referenced.url)})`
      }

      return `Renames and re-exports [${
        referenced.name
      }](${Handlebars.helpers.relativeURL(referenced.url)})`
    }
  )
}
