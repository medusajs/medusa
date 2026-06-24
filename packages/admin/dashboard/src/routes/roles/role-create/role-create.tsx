import { RouteFocusModal } from "../../../components/modals"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { CreateRoleForm } from "./components/create-role-form"

export const RoleCreate = () => {
  const isRbacEnabled = useRequireRbacFeature()

  if (!isRbacEnabled) {
    return null
  }

  return (
    <RouteFocusModal>
      <CreateRoleForm />
    </RouteFocusModal>
  )
}
