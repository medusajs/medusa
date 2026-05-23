import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { CreatePolicyForm } from "./components/create-policy-form"

export const PolicyCreate = () => {
  const isRbacEnabled = useFeatureFlag("rbac")
  const navigate = useNavigate()

  useEffect(() => {
    if (!isRbacEnabled) {
      navigate(-1)
    }
  }, [isRbacEnabled, navigate])

  if (!isRbacEnabled) {
    return null
  }

  return (
    <RouteFocusModal>
      <CreatePolicyForm />
    </RouteFocusModal>
  )
}
