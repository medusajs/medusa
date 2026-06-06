import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import {
  Button,
  Checkbox,
  DataTableRowSelectionState,
  Hint,
  createDataTableColumnHelper,
  toast,
} from "@zjedene-medusa/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { ConditionalTooltip } from "../../../../../components/common/conditional-tooltip"
import { DataTable } from "../../../../../components/data-table"
import * as hooks from "../../../../../components/data-table/helpers/sales-channels"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { VisuallyHidden } from "../../../../../components/utilities/visually-hidden"
import { useBatchAddSalesChannelsToApiKey } from "../../../../../hooks/api/api-keys"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"

type ApiKeySalesChannelFormProps = {
  apiKey: string
  preSelected?: string[]
}

const AddSalesChannelsToApiKeySchema = zod.object({
  sales_channel_ids: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50
const PREFIX = "sc_add"

export const ApiKeySalesChannelsForm = ({
  apiKey,
  preSelected = [],
}: ApiKeySalesChannelFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddSalesChannelsToApiKeySchema>>({
    defaultValues: {
      sales_channel_ids: [],
    },
    resolver: zodResolver(AddSalesChannelsToApiKeySchema),
  })

  const { setValue } = form

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { mutateAsync, isPending: isMutating } =
    useBatchAddSalesChannelsToApiKey(apiKey)

  const searchParams = hooks.useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const columns = useColumns()
  const filters = hooks.useSalesChannelTableFilters()
  const emptyState = hooks.useSalesChannelTableEmptyState()

  const { sales_channels, count, isPending } = useSalesChannels(
    { ...searchParams },
    {
      placeholderData: keepPreviousData,
    }
  )

  const updater = (selection: DataTableRowSelectionState) => {
    const ids = Object.keys(selection)

    setValue("sales_channel_ids", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(selection)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values.sales_channel_ids, {
      onSuccess: () => {
        toast.success(
          t("apiKeyManagement.salesChannels.successToast", {
            count: values.sales_channel_ids.length,
          })
        )

        handleSuccess()
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <RouteFocusModal.Title asChild>
            <VisuallyHidden>
              {t("apiKeyManagement.salesChannels.title")}
            </VisuallyHidden>
          </RouteFocusModal.Title>
          <RouteFocusModal.Description asChild>
            <VisuallyHidden>
              {t("apiKeyManagement.salesChannels.description")}
            </VisuallyHidden>
          </RouteFocusModal.Description>
          <div className="flex items-center justify-end gap-x-2">
            {form.formState.errors.sales_channel_ids && (
              <Hint variant="error">
                {form.formState.errors.sales_channel_ids.message}
              </Hint>
            )}
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-auto">
          <DataTable
            data={sales_channels}
            columns={columns}
            filters={filters}
            getRowId={(row) => row.id}
            rowCount={count}
            layout="fill"
            emptyState={emptyState}
            isLoading={isPending}
            rowSelection={{
              state: rowSelection,
              onRowSelectionChange: updater,
              enableRowSelection: (row) => !preSelected.includes(row.id),
            }}
            prefix={PREFIX}
            pageSize={PAGE_SIZE}
            autoFocusSearch
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminSalesChannel>()

const useColumns = () => {
  const { t } = useTranslation()
  const base = hooks.useSalesChannelTableColumns()

  return useMemo(
    () => [
      columnHelper.select({
        cell: ({ row }) => {
          const isPreSelected = !row.getCanSelect()
          const isSelected = row.getIsSelected() || isPreSelected

          return (
            <ConditionalTooltip
              content={t("apiKeyManagement.salesChannels.alreadyAddedTooltip")}
              showTooltip={isPreSelected}
            >
              <div>
                <Checkbox
                  checked={isSelected}
                  disabled={isPreSelected}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                />
              </div>
            </ConditionalTooltip>
          )
        },
      }),
      ...base,
    ],
    [t, base]
  )
}
