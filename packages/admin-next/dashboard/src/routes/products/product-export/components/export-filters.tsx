import { Heading, Text } from "@medusajs/ui"
import { DataTableFilter } from "../../../../components/table/data-table/data-table-filter"
import { useTranslation } from "react-i18next"
import { useProductTableFilters } from "../../../../hooks/table/filters"

export const ExportFilters = () => {
  const { t } = useTranslation()
  const filters = useProductTableFilters()

  return (
    <div>
      <Heading level="h2">{t("products.export.filters.title")}</Heading>
      <Text size="small" className="text-ui-fg-subtle">
        {t("products.export.filters.description")}
      </Text>

      <div className="mt-4">
        <DataTableFilter filters={filters} readonly />
      </div>
    </div>
  )
}
