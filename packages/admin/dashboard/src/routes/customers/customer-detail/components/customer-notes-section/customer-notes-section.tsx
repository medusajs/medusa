import { HttpTypes } from "@medusajs/types"

import { ResourceNotesSection } from "../../../../../components/common/resource-notes-section"

type CustomerNotesSectionProps = {
  customer: HttpTypes.AdminCustomer
}

export const CustomerNotesSection = ({
  customer,
}: CustomerNotesSectionProps) => {
  return (
    <ResourceNotesSection resourceType="customer" resourceId={customer.id} />
  )
}
