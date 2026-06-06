import { HttpTypes } from "@zjedene-medusa/types"

export type AdminOrderPreviewLineItem = HttpTypes.AdminOrderLineItem & {
  actions?: HttpTypes.AdminOrderChangeAction[]
}
