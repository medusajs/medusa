import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useRbacPolicy } from "../../../hooks/api/rbac-policies"
import { EditPolicyForm } from "./components/edit-policy-form"

export const PolicyEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { policy, isPending, isError, error } = useRbacPolicy(id!, {
    fields: "id,key,resource,operation,name,description",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("policies.edit.header")}</Heading>
      </RouteDrawer.Header>
      {!isPending && policy && <EditPolicyForm policy={policy} />}
    </RouteDrawer>
  )
}
