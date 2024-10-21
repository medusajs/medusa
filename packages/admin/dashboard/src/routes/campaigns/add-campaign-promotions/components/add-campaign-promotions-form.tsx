import { zodResolver } from "@hookform/resolvers/zod"
import { AdminCampaign, HttpTypes } from "@medusajs/types"
import { Button, Checkbox, Hint, Tooltip, toast } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { RouteFocusModal, useRouteModal } from "../../../../components/modals"
import { DataTable } from "../../../../components/table/data-table"
import { KeyboundForm } from "../../../../components/utilities/keybound-form"
import { useAddOrRemoveCampaignPromotions } from "../../../../hooks/api/campaigns"
import { usePromotions } from "../../../../hooks/api/promotions"
import { usePromotionTableColumns } from "../../../../hooks/table/columns/use-promotion-table-columns"
import { usePromotionTableFilters } from "../../../../hooks/table/filters/use-promotion-table-filters"
import { usePromotionTableQuery } from "../../../../hooks/table/query/use-promotion-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"

type AddCampaignPromotionsFormProps = {
  campaign: AdminCampaign
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
    meta: {
      campaignId: campaign.id,
      currencyCode: campaign?.budget?.currency_code,
      budgetType: campaign?.budget?.type,
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      { add: values.promotion_ids },
      {
        onSuccess: () => {
          toast.success(
            t("campaigns.promotions.toast.success", {
              count: values.promotion_ids.length,
            })
          )
          handleSuccess()
        },
        onError: (error) => toast.error(error.message),
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
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
            orderBy={[
              { key: "code", label: t("fields.code") },
              { key: "type", label: t("fields.type") },
              { key: "created_at", label: t("fields.createdAt") },
              { key: "updated_at", label: t("fields.updatedAt") },
            ]}
            queryObject={raw}
            layout="fill"
            pagination
            search="autofocus"
            noRecords={{
              message: t("campaigns.promotions.add.list.noRecordsMessage"),
            }}
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminPromotion>()

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
          const { campaignId, currencyCode, budgetType } = table.options
            .meta as {
            campaignId: string
            currencyCode: string
            budgetType: string
          }

          const isTypeSpend = budgetType === "spend"
          const isAdded = row.original.campaign_id === campaignId
          const isAddedToADiffCampaign =
            !!row.original.campaign_id &&
            row.original.campaign_id !== campaignId
          const currencyMismatch =
            isTypeSpend &&
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
