import { Drawer, Heading } from "@medusajs/ui"
import { useAdminCollection } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditCollectionForm } from "./components/edit-collection-form"

export const CollectionEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { collection, isLoading, isError, error } = useAdminCollection(id!)

  const [open, onOpenChange, subscribe] = useRouteModalState()

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("collections.editCollection")}</Heading>
        </Drawer.Header>
        {!isLoading && collection && (
          <EditCollectionForm
            collection={collection}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
