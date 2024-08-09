import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useReturnReasons } from "../../../../../hooks/api/return-reasons"
import { useReturnReasonTableColumns } from "../../../../../hooks/table/columns"
import { useReturnReasonTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useDeleteReturnReasonAction } from "../../../common/hooks/use-delete-return-reason-action"

const PAGE_SIZE = 20

export const ReturnReasonListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useReturnReasonTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { return_reasons, count, isPending, isError, error } = useReturnReasons(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()

  const { table } = useDataTable({
    data: return_reasons,
    columns,
    count,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y px-0 py-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("returnReasons.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("returnReasons.subtitle")}
          </Text>
        </div>
        <Button variant="secondary" size="small" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        queryObject={raw}
        count={count}
        isLoading={isPending}
        columns={columns}
        pageSize={PAGE_SIZE}
        noHeader={true}
        pagination
        search
      />
    </Container>
  )
}

type ReturnReasonRowActionsProps = {
  returnReason: HttpTypes.AdminReturnReason
}

const ReturnReasonRowActions = ({
  returnReason,
}: ReturnReasonRowActionsProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteReturnReasonAction(returnReason)

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `${returnReason.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminReturnReason>()

const useColumns = () => {
  const base = useReturnReasonTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <ReturnReasonRowActions returnReason={row.original} />
        ),
      }),
    ],
    [base]
  )
}
