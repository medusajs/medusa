import { PencilSquare, Trash } from "@medusajs/icons"
import type { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useDeleteRegion, useRegions } from "../../../../../hooks/api/regions"
import { useRegionTableColumns } from "../../../../../hooks/table/columns/use-region-table-columns"
import { useRegionTableFilters } from "../../../../../hooks/table/filters/use-region-table-filters"
import { useRegionTableQuery } from "../../../../../hooks/table/query/use-region-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const RegionListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useRegionTableQuery({ pageSize: PAGE_SIZE })
  const {
    regions,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useRegions(
    {
      ...searchParams,
      fields: "*payment_providers",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useRegionTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: (regions ?? []) as HttpTypes.AdminRegion[],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("regions.domain")}</Heading>
        <Link to="/settings/regions/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>

      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        filters={filters}
        orderBy={["name", "created_at", "updated_at"]}
        navigateTo={(row) => `${row.original.id}`}
        pagination
        search
        queryObject={raw}
      />
    </Container>
  )
}

const RegionActions = ({ region }: { region: HttpTypes.AdminRegion }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteRegion(region.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.deleteRegionWarning", {
        name: region.name,
      }),
      verificationText: region.name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await mutateAsync(undefined)
      toast.success(t("general.success"), {
        description: t("regions.toast.delete"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              to: `/settings/regions/${region.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminRegion>()

const useColumns = () => {
  const base = useRegionTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <RegionActions region={row.original} />
        },
      }),
    ],
    [base]
  )
}
