import { FORM_IDS } from "./constants"
import { FormId } from "./types"

export function isValidFormId(id: any): id is FormId {
  return FORM_IDS.includes(id)
}
