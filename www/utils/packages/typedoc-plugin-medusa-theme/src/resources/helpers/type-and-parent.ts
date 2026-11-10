import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { ArrayType, ReferenceType } from "typedoc"
import { escapeChars, getReflectionUrl } from "utils"

export default function () {
  Handlebars.registerHelper(
    "typeAndParent",
    function (this: ArrayType | ReferenceType) {
      const getUrl = (name: string, url: string) =>
        `[${name}](${Handlebars.helpers.relativeURL(url)})`
      if (this) {
        if ("elementType" in this) {
          return Handlebars.helpers.typeAndParent.call(this.elementType) + "[]"
        } else {
          if (this.reflection) {
            const md: string[] = []
            if (this.reflection instanceof SignatureReflection) {
              const grandparentUrl = getReflectionUrl(
                this.reflection.parent?.parent
              )
              if (grandparentUrl) {
                md.push(
                  getUrl(this.reflection.parent.parent!.name, grandparentUrl)
                )
                const parentUrl = getReflectionUrl(this.reflection.parent)
                if (parentUrl) {
                  md.push(getUrl(this.reflection.parent.name, parentUrl))
                }
              }
            } else {
              const parentUrl = getReflectionUrl(this.reflection.parent)
              if (parentUrl) {
                md.push(getUrl(this.reflection.parent!.name, parentUrl))
                const reflectionUrl = getReflectionUrl(this.reflection)
                if (reflectionUrl) {
                  md.push(getUrl(this.reflection.name, reflectionUrl))
                }
              }
            }
            return md.join(".")
          } else {
            return escapeChars(this.toString())
          }
        }
      }
      return "void"
    }
  )
}
