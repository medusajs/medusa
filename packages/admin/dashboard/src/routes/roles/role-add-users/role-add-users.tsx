import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { AddUsersForm } from "./components/add-users-form"

export const RoleAddUsers = () => {
  const { id } = useParams()

  return (
    <RouteFocusModal>
      <AddUsersForm roleId={id!} />
    </RouteFocusModal>
  )
}
