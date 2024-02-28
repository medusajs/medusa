import { Heading } from "@medusajs/ui"
import {
  useAdminRegion,
  useAdminShippingOption,
  useAdminStore,
} from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditShippingOptionForm } from "./components/edit-shipping-option-form"

export const RegionEditShippingOption = () => {
  const { id, so_id } = useParams()
  const { t } = useTranslation()

  const {
    region,
    isLoading: isLoadingRegion,
    isError: isRegionError,
    error: regionError,
  } = useAdminRegion(id!)

  const {
    store,
    isLoading: isLoadingStore,
    isError: isStoreError,
    error: storeError,
  } = useAdminStore()

  const {
    shipping_option,
    isLoading: isLoadingOption,
    isError: isOptionError,
    error: optionError,
  } = useAdminShippingOption(so_id!)

  const isLoading = isLoadingRegion || isLoadingOption || isLoadingStore

  if (isRegionError) {
    throw regionError
  }

  if (isOptionError) {
    throw optionError
  }

  if (isStoreError) {
    throw storeError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("regions.shippingOption.editShippingOption")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && region && shipping_option && store && (
        <EditShippingOptionForm
          store={store}
          region={region}
          shippingOption={shipping_option}
        />
      )}
    </RouteDrawer>
  )
}
