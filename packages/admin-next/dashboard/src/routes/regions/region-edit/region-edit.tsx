import { Heading } from "@medusajs/ui"
import { useAdminRegion } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { EditRegionForm } from "./components/edit-region-form"

export const RegionEdit = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const { region, isLoading, isError, error } = useAdminRegion(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("regions.editRegion")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && region && <EditRegionForm region={region} />}
    </RouteDrawer>
  )
}
