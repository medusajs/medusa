import { Container, Heading, Text } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { DataTable } from "../../../components/data-table"
import { useEntities } from "../../../hooks/api/views"
import { usePropertyLabelsTableColumns } from "../../../hooks/table/columns"
import { useQueryParams } from "../../../hooks/use-query-params"

const PAGE_SIZE = 15
const PREFIX = "pl"

export const PropertyLabelsList = () => {
  const { t } = useTranslation()
  // The entities endpoint returns the full list in one call, so pagination is
  // applied client-side by slicing the current page out of `entities`.
  const { entities, isPending, isError, error } = useEntities()
  const columns = usePropertyLabelsTableColumns()

  const { offset } = useQueryParams(["offset"], PREFIX)
  const start = offset ? parseInt(offset, 10) : 0

  const paginatedEntities = useMemo(
    () => (entities ?? []).slice(start, start + PAGE_SIZE),
    [entities, start]
  )

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
        enablePagination
        enableSearch={false}
        data={paginatedEntities}
        rowCount={entities?.length ?? 0}
        pageSize={PAGE_SIZE}
        prefix={PREFIX}
        isLoading={isPending}
        getRowId={(row) => `${row.module}-${row.name}`}
      />
    </Container>
  )
}
