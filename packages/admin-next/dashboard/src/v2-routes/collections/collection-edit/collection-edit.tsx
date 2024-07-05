import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useCollection } from "../../../hooks/api/collections"
import { EditCollectionForm } from "./components/edit-collection-form"

export const CollectionEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { collection, isLoading, isError, error } = useCollection(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("collections.editCollection")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && collection && (
        <EditCollectionForm collection={collection} />
      )}
    </RouteDrawer>
  )
}
