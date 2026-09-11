import {
  DataTable,
  RouteFocusModal,
  useRouteModal,
} from "@medusajs/dashboard/components"
import { useSalesChannels, useUpdateProduct } from "@medusajs/dashboard/hooks"
import { Button, createDataTableColumnHelper } from "@medusajs/ui"
import { RowSelectionState } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import * as zod from "@medusajs/framework/zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import {
  useSalesChannelTableColumns,
  useSalesChannelTableEmptyState,
  useSalesChannelTableFilters,
  useSalesChannelTableQuery,
} from "@medusajs/dashboard/hooks"

type EditSalesChannelsFormProps = {
  product: HttpTypes.AdminProduct
}

const EditSalesChannelsSchema = zod.object({
  sales_channels: zod.array(zod.string()).optional(),
})

const PAGE_SIZE = 50
const PREFIX = "sc"

export const EditSalesChannelsForm = ({
  product,
}: EditSalesChannelsFormProps) => {
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditSalesChannelsSchema>>({
    defaultValues: {
      sales_channels: product.sales_channels?.map((sc) => sc.id) ?? [],
    },
    resolver: zodResolver(EditSalesChannelsSchema),
  })

  const { setValue } = form

  const initialState =
    product.sales_channels?.reduce((acc, curr) => {
      acc[curr.id] = true
      return acc
    }, {} as RowSelectionState) ?? {}

  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialState)

  useEffect(() => {
    const ids = Object.keys(rowSelection)
    setValue("sales_channels", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, setValue])

  const searchParams = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { sales_channels, count, isLoading, isError, error } = useSalesChannels(
    {
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useSalesChannelTableFilters()
  const emptyState = useSalesChannelTableEmptyState()
  const columns = useColumns()

  const { mutateAsync, isPending: isMutating } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const arr = data.sales_channels ?? []

    const sales_channels = arr.map((id) => {
      return {
        id,
      }
    })

    await mutateAsync(
      {
        sales_channels,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <div className="flex h-full flex-col overflow-hidden">
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex-1 overflow-hidden">
          <DataTable
            data={sales_channels}
            columns={columns}
            getRowId={(row) => row.id}
            rowCount={count}
            isLoading={isLoading}
            filters={filters}
            rowSelection={{
              state: rowSelection,
              onRowSelectionChange: setRowSelection,
            }}
            autoFocusSearch
            layout="fill"
            emptyState={emptyState}
            prefix={PREFIX}
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" isLoading={isMutating} onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </div>
    </RouteFocusModal.Form>
  )
}

const columnHelper =
  createDataTableColumnHelper<
    HttpTypes.AdminSalesChannelResponse["sales_channel"]
  >()

const useColumns = () => {
  const columns = useSalesChannelTableColumns()

  return useMemo(() => [columnHelper.select(), ...columns], [columns])
}
