import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { ArrayType, ReferenceType } from "typedoc/dist/lib/models/types"
import { escapeChars } from "utils"

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
              if (this.reflection.parent?.parent?.url) {
                md.push(
                  getUrl(
                    this.reflection.parent.parent.name,
                    this.reflection.parent.parent.url
                  )
                )
                if (this.reflection.parent.url) {
                  md.push(
                    getUrl(
                      this.reflection.parent.name,
                      this.reflection.parent.url
                    )
                  )
                }
              }
            } else {
              if (this.reflection.parent?.url) {
                md.push(
                  getUrl(
                    this.reflection.parent.name,
                    this.reflection.parent.url
                  )
                )
                if (this.reflection.url) {
                  md.push(getUrl(this.reflection.name, this.reflection.url))
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
