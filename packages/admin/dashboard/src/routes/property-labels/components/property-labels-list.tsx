import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { useEntities } from "../../../hooks/api/views"
import { DataTable } from "../../../components/data-table"
import { usePropertyLabelsTableColumns } from "../../../hooks/table/columns"

export const PropertyLabelsList = () => {
  const { t } = useTranslation()
  // TODO: Implement pagination and filters
  const { entities, isPending, isError, error } = useEntities()
  const columns = usePropertyLabelsTableColumns()

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading>{t("propertyLabels.title")}</Heading>
        <Text>{t("propertyLabels.subtitle")}</Text>
      </div>

      <DataTable
        columns={columns}
        enablePagination={false}
        enableSearch={false}
        data={entities}
        isLoading={isPending}
        getRowId={(row) => `${row.module}-${row.name}`}
      />
    </Container>
  )
}
