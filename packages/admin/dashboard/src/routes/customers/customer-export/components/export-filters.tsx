import { Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { DataTableFilter } from "../../../../components/table/data-table/data-table-filter"
import { useCustomerTableFilters } from "../../../../hooks/table/filters"

export const ExportFilters = () => {
  const { t } = useTranslation()
  const filters = useCustomerTableFilters()

  return (
    <div>
      <Heading level="h2">{t("customers.export.filters.title")}</Heading>
      <Text size="small" className="text-ui-fg-subtle">
        {t("customers.export.filters.description")}
      </Text>

      <div className="mt-4">
        <DataTableFilter filters={filters} readonly />
      </div>
    </div>
  )
}
