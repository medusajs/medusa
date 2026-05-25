import { RouteFocusModal } from "../../../components/modals"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { CreatePolicyForm } from "./components/create-policy-form"

export const PolicyCreate = () => {
  const isRbacEnabled = useRequireRbacFeature()

  if (!isRbacEnabled) {
    return null
  }

  return (
    <RouteFocusModal>
      <CreatePolicyForm />
    </RouteFocusModal>
  )
}
