import { PencilSquare, Trash } from "@medusajs/icons"
import { CampaignResponse } from "@medusajs/types"
import { Button, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../components/common/action-menu"
import { DataTable } from "../../../../components/table/data-table"
import {
  useCampaigns,
  useDeleteCampaign,
} from "../../../../hooks/api/campaigns"
import { useCampaignTableColumns } from "../../../../hooks/table/columns/use-campaign-table-columns"
import { useCampaignTableQuery } from "../../../../hooks/table/query/use-campaign-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const CampaignListTable = () => {
  const { t } = useTranslation()
  const { raw, searchParams } = useCampaignTableQuery({ pageSize: PAGE_SIZE })

  const {
    campaigns,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useCampaigns(searchParams, {
    placeholderData: keepPreviousData,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: campaigns ?? [],
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
        <Heading level="h2">{t("campaigns.domain")}</Heading>
        <Link to="/campaigns/create">
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
        pagination
        search
        navigateTo={(row) => row.id}
        isLoading={isLoading}
        queryObject={raw}
        orderBy={["name", "created_at", "updated_at"]}
      />
    </Container>
  )
}

const CampaignActions = ({ campaign }: { campaign: CampaignResponse }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteCampaign(campaign.id)

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("campaigns.deleteCampaignWarning", {
        name: campaign.name,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: campaign.name,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    try {
      await mutateAsync()
      toast.success(t("general.success"), {
        description: t("campaigns.toast.delete"),
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
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/campaigns/${campaign.id}/edit`,
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

const columnHelper = createColumnHelper<CampaignResponse>()

const useColumns = () => {
  const base = useCampaignTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <CampaignActions campaign={row.original} />
        },
      }),
    ],
    [base]
  )
}
