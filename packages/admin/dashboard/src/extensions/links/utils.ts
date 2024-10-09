import { CustomFieldModel } from "@medusajs/admin-shared"
import linkModule from "virtual:medusa/links"

function appendLinkableFields(
  fields: string = "",
  linkable: (string | string[])[] = []
) {
  const linkableFields = linkable.flatMap((link) => {
    return typeof link === "string"
      ? [`+${link}.*`]
      : link.map((l) => `+${l}.*`)
  })

  return [fields, ...linkableFields].join(",")
}

export function getLinkedFields(model: CustomFieldModel, fields: string = "") {
  const links = linkModule.links[model]
  return appendLinkableFields(fields, links)
}
