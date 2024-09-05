import { useParams } from "react-router-dom"
import { MetadataForm } from "../../../components/forms/metadata-form"
import {
  useCustomerGroup,
  useUpdateCustomerGroup,
} from "../../../hooks/api/customer-groups"

export const CustomerGroupMetadata = () => {
  const { id } = useParams()

  const { customer_group, isPending, isError, error } = useCustomerGroup(id!)
  const { mutateAsync, isPending: isMutating } = useUpdateCustomerGroup(id!)

  if (isError) {
    throw error
  }

  return (
    <MetadataForm
      metadata={customer_group?.metadata}
      hook={mutateAsync}
      isPending={isPending}
      isMutating={isMutating}
    />
  )
}
