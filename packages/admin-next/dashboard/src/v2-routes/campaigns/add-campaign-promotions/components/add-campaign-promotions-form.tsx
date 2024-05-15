import { zodResolver } from "@hookform/resolvers/zod"
import { CampaignResponse, PromotionDTO } from "@medusajs/types"
import { Button, Checkbox, Hint, toast, Tooltip } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import {
  createColumnHelper,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../components/route-modal"
import { DataTable } from "../../../../components/table/data-table"
import { useAddOrRemoveCampaignPromotions } from "../../../../hooks/api/campaigns"
import { usePromotions } from "../../../../hooks/api/promotions"
import { usePromotionTableColumns } from "../../../../hooks/table/columns-v2/use-promotion-table-columns"
import { usePromotionTableFilters } from "../../../../hooks/table/filters/use-promotion-table-filters"
import { usePromotionTableQuery } from "../../../../hooks/table/query-v2/use-promotion-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"

type AddCampaignPromotionsFormProps = {
  campaign: CampaignResponse
}

const AddCampaignPromotionsSchema = zod.object({
  promotion_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50

export const AddCampaignPromotionsForm = ({
  campaign,
}: AddCampaignPromotionsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddCampaignPromotionsSchema>>({
    defaultValues: { promotion_ids: [] },
    resolver: zodResolver(AddCampaignPromotionsSchema),
  })

  const { setValue } = form
  const { mutateAsync, isPending } = useAddOrRemoveCampaignPromotions(
    campaign.id
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const state = typeof fn === "function" ? fn(rowSelection) : fn
    const ids = Object.keys(state)

    setValue("promotion_ids", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(state)
  }

  const { searchParams, raw } = usePromotionTableQuery({ pageSize: PAGE_SIZE })
  const {
    promotions,
    count,
    isPending: isLoading,
  } = usePromotions({ ...searchParams }, { placeholderData: keepPreviousData })

  const columns = useColumns()
  const filters = usePromotionTableFilters()

  const { table } = useDataTable({
    data: promotions ?? [],
    columns,
    enableRowSelection: (row) => {
      return row.original.campaign_id !== campaign.id
    },
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    count,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    meta: { campaignId: campaign.id, currencyCode: campaign.currency },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      { add: values.promotion_ids },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("campaigns.promotions.toast.success", {
              count: values.promotion_ids.length,
            }),
            dismissLabel: t("actions.close"),
          })
          handleSuccess()
        },
        onError: (error) =>
          toast.error(t("general.error"), {
            description: error.message,
            dismissLabel: t("actions.close"),
          }),
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            {form.formState.errors.promotion_ids && (
              <Hint variant="error">
                {form.formState.errors.promotion_ids.message}
              </Hint>
            )}
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex size-full flex-col overflow-y-auto">
          <DataTable
            table={table}
            count={count}
            columns={columns}
            pageSize={PAGE_SIZE}
            isLoading={isLoading}
            filters={filters}
            orderBy={["title", "status", "created_at", "updated_at"]}
            queryObject={raw}
            layout="fill"
            pagination
            search
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<PromotionDTO>()

const useColumns = () => {
  const base = usePromotionTableColumns()
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            />
          )
        },
        cell: ({ row, table }) => {
          const { campaignId, currencyCode } = table.options.meta as {
            campaignId: string
            currencyCode: string
          }

          const isAdded = row.original.campaign_id === campaignId
          const isAddedToADiffCampaign =
            !!row.original.campaign_id &&
            row.original.campaign_id !== campaignId
          const currencyMismatch =
            row.original.application_method?.currency_code !== currencyCode
          const isSelected = row.getIsSelected() || isAdded
          const isIndeterminate = currencyMismatch || isAddedToADiffCampaign

          const Component = (
            <Checkbox
              checked={isIndeterminate ? "indeterminate" : isSelected}
              disabled={isAdded || isAddedToADiffCampaign || currencyMismatch}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isAddedToADiffCampaign) {
            return (
              <Tooltip
                content={t("campaigns.promotions.alreadyAddedDiffCampaign", {
                  name: row.original?.campaign?.name!,
                })}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          if (currencyMismatch) {
            return (
              <Tooltip
                content={t("campaigns.promotions.currencyMismatch")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          if (isAdded) {
            return (
              <Tooltip
                content={t("campaigns.promotions.alreadyAdded")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      ...base,
    ],
    [t, base]
  )
}
