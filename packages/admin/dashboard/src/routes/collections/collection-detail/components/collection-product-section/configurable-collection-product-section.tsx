import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import { ConfigurableDataTable } from "../../../../../components/table/configurable-data-table"
import { useCollectionProductTableAdapter } from "./collection-product-table-adapter"

export const ConfigurableCollectionProductSection = ({
  collection,
}: {
  collection: HttpTypes.AdminCollection
}) => {
  const { t } = useTranslation()
  const adapter = useCollectionProductTableAdapter(collection.id!)

  return (
    <ConfigurableDataTable
      adapter={adapter}
      heading={t("products.domain")}
      actions={[{ label: t("actions.add"), to: "products" }]}
    />
  )
}
