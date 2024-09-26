import linkedModels from "virtual:medusa/links"
import { appendLinkableFields } from "../../../extensions/links/utils"

export function getExtendedProductFields(fields?: string) {
  return appendLinkableFields(fields, linkedModels.customFieldLinks.product)
}
