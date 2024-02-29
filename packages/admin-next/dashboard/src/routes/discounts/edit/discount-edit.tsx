import { Heading } from "@medusajs/ui"
import { useAdminDiscount } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { EditDiscountForm } from "./components/edit-discount-form"

export const DiscountEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { discount, isLoading, isError, error } = useAdminDiscount(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("discounts.editDiscount")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && discount && <EditDiscountForm discount={discount} />}
    </RouteDrawer>
  )
}
