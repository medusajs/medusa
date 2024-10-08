import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { AddCustomerGroupsForm } from "./components/add-customers-form"

export const CustomerAddCustomerGroups = () => {
  const { id } = useParams()

  return (
    <RouteFocusModal>
      <AddCustomerGroupsForm customerId={id!} />
    </RouteFocusModal>
  )
}
