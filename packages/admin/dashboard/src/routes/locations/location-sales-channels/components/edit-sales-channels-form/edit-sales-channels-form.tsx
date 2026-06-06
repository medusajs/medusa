import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import {
  Button,
  createDataTableColumnHelper,
  DataTableRowSelectionState,
  toast,
} from "@zjedene-medusa/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { DataTable } from "../../../../../components/data-table"
import * as hooks from "../../../../../components/data-table/helpers/sales-channels"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { VisuallyHidden } from "../../../../../components/utilities/visually-hidden"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { useUpdateStockLocationSalesChannels } from "../../../../../hooks/api/stock-locations"

type EditSalesChannelsFormProps = {
  location: HttpTypes.AdminStockLocation
}

const EditSalesChannelsSchema = zod.object({
  sales_channels: zod.array(zod.string()).optional(),
})

const PAGE_SIZE = 20
const PREFIX = "sc"

export const LocationEditSalesChannelsForm = ({
  location,
}: EditSalesChannelsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditSalesChannelsSchema>>({
    defaultValues: {
      sales_channels: location.sales_channels?.map((sc) => sc.id) ?? [],
    },
    resolver: zodResolver(EditSalesChannelsSchema),
  })

  const { setValue } = form

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    getInitialState(location)
  )

  const onRowSelectionChange = (selection: DataTableRowSelectionState) => {
    const ids = Object.keys(selection)
    setValue("sales_channels", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })
    setRowSelection(selection)
  }

  const searchParams = hooks.useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const { sales_channels, count, isPending, isError, error } = useSalesChannels(
    {
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = hooks.useSalesChannelTableFilters()
  const columns = useColumns()
  const emptyState = hooks.useSalesChannelTableEmptyState()

  const { mutateAsync, isPending: isMutating } =
    useUpdateStockLocationSalesChannels(location.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const originalIds = location.sales_channels?.map((sc) => sc.id)

    const arr = data.sales_channels ?? []

    await mutateAsync(
      {
        add: arr.filter((i) => !originalIds?.includes(i)),
        remove: originalIds?.filter((i) => !arr.includes(i)),
      },
      {
        onSuccess: () => {
          toast.success(t("stockLocations.salesChannels.successToast"))
          handleSuccess(`/settings/locations/${location.id}`)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <RouteFocusModal.Title asChild>
            <VisuallyHidden>
              {t("stockLocations.salesChannels.header")}
            </VisuallyHidden>
          </RouteFocusModal.Title>
          <RouteFocusModal.Description asChild>
            <VisuallyHidden>
              {t("stockLocations.salesChannels.hint")}
            </VisuallyHidden>
          </RouteFocusModal.Description>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-auto">
          <DataTable
            data={sales_channels}
            columns={columns}
            filters={filters}
            emptyState={emptyState}
            prefix={PREFIX}
            rowSelection={{
              state: rowSelection,
              onRowSelectionChange,
            }}
            pageSize={PAGE_SIZE}
            isLoading={isPending}
            rowCount={count}
            layout="fill"
            getRowId={(row) => row.id}
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary" type="button">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" isLoading={isMutating} type="submit">
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
  const base = hooks.useSalesChannelTableColumns()

  return useMemo(() => [columnHelper.select(), ...base], [base])
}

function getInitialState(location: HttpTypes.AdminStockLocation) {
  return (
    location.sales_channels?.reduce((acc, curr) => {
      acc[curr.id] = true
      return acc
    }, {} as DataTableRowSelectionState) ?? {}
  )
}
