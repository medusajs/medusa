import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/route-modal"
import { useV2Store } from "../../../lib/api-v2"
import { EditStoreForm } from "./components/edit-store-form/edit-store-form"

export const StoreEdit = () => {
  const { t } = useTranslation()
  const { store, isLoading, isError, error } = useV2Store()

  if (isError) {
    throw error
  }

  const ready = !!store && !isLoading

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("store.edit.header")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditStoreForm store={store} />}
    </RouteDrawer>
  )
}
