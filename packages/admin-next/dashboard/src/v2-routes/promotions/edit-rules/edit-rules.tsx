import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { useV2Promotion } from "../../../lib/api-v2/promotion"
import { EditRulesForm } from "./components/edit-rules-form"

export const EditRules = () => {
  const { id, ruleType: ruleTypeParam } = useParams()
  const { t } = useTranslation()
  const ruleType = ruleTypeParam!.split("-").join("_")

  const { promotion, isLoading, isError, error } = useV2Promotion(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t(`promotions.edit.${ruleType}.title`)}</Heading>
      </RouteDrawer.Header>

      {!isLoading && promotion && (
        <EditRulesForm promotion={promotion} ruleType={ruleType} />
      )}
    </RouteDrawer>
  )
}
