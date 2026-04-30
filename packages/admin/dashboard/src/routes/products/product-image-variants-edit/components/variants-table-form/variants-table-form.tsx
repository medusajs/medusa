import { Button, Checkbox, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  createColumnHelper,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { keepPreviousData } from "@tanstack/react-query"
import * as zod from "zod"

import { AdminProduct } from "@medusajs/types"

import { _DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import {
  useBatchImageVariants,
  useProductVariants,
} from "../../../../../hooks/api"
import { useProductVariantTableQuery } from "../../../../../hooks/table/query/use-product-variant-table-query"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"

const PAGE_SIZE = 20

type VariantsTableFormProps = {
  productId: string
  image: { id: string; url?: string; variants: { id: string }[] }
}

const BatchImageVariantsSchema = zod.object({
  variants: zod.array(zod.string()),
})

const variantColumnHelper =
  createColumnHelper<NonNullable<AdminProduct["variants"]>[0]>()

export const VariantsTableForm = ({
  productId,
  image,
}: VariantsTableFormProps) => {
  const { t } = useTranslation()

  const { handleSuccess } = useRouteModal()

  const { mutateAsync, isPending } = useBatchImageVariants(productId, image.id)

  const [variantSelection, setVariantSelection] = useState<RowSelectionState>(
    () =>
      image.variants?.reduce((acc, variant) => {
        acc[variant.id] = true
        return acc
      }, {} as RowSelectionState) || {}
  )

  useEffect(() => {
    setVariantSelection(
      image.variants?.reduce((acc, variant) => {
        acc[variant.id] = true
        return acc
      }, {} as RowSelectionState) || {}
    )
  }, [image.variants.length])

  const form = useForm<zod.infer<typeof BatchImageVariantsSchema>>({
    defaultValues: {
      variants: image.variants?.map((variant) => variant.id) || [],
    },
    resolver: zodResolver(BatchImageVariantsSchema),
  })

  const handleSubmit = form.handleSubmit(async () => {
    const initialVariantIds =
      image?.variants?.map((variant) => variant.id) || []

    const newVariantIds = Object.keys(variantSelection).filter(
      (k) => variantSelection[k]
    )

    const variantsToAdd = newVariantIds.filter(
      (id) => !initialVariantIds.includes(id)
    )

    const variantsToRemove = initialVariantIds.filter(
      (id) => !newVariantIds.includes(id)
    )

    // TODO: remove thumbnail if variant is removed

    await mutateAsync(
      {
        add: variantsToAdd,
        remove: variantsToRemove,
      },
      {
        onSuccess: () => {
          toast.success(t("products.variantMedia.successToast"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const columns = useMemo(
    () => [
      variantColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      variantColumnHelper.accessor("title", {
        header: () => t("fields.title"),
        cell: ({ getValue }) => {
          const title = getValue()
          return (
            <div className="flex h-full w-full items-center">
              <span className="truncate">{title || "-"}</span>
            </div>
          )
        },
      }),
      variantColumnHelper.accessor("sku", {
        header: () => t("fields.sku"),
        cell: ({ getValue }) => {
          const sku = getValue()
          return (
            <div className="flex h-full w-full items-center">
              <span className="truncate font-mono text-sm">{sku || "-"}</span>
            </div>
          )
        },
      }),
      variantColumnHelper.accessor("thumbnail", {
        header: () => t("fields.thumbnail"),
        cell: ({ getValue }) => {
          const isThumbnail = getValue() === image.url
          return (
            <div className="flex h-full w-full items-center">
              <span className="truncate text-sm">
                {isThumbnail ? t("fields.true") : t("fields.false")}
              </span>
            </div>
          )
        },
      }),
    ],
    [t]
  )

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(variantSelection) : value
    setVariantSelection(state)
    const formState = Object.keys(state).filter((k) => state[k])

    form.setValue("variants", formState, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const { searchParams, raw } = useProductVariantTableQuery({
    pageSize: PAGE_SIZE,
  })

  const {
    variants,
    count,
    isPending: isLoading,
  } = useProductVariants(
    productId,
    {
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const { table } = useDataTable({
    data: variants || [],
    columns,
    count: count,
    enablePagination: true,
    enableRowSelection: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
    rowSelection: {
      state: variantSelection,
      updater,
    },
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-col gap-y-8 overflow-y-auto p-0">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-hidden">
              <_DataTable
                layout="fill"
                table={table}
                columns={columns}
                count={count}
                isLoading={isLoading}
                pageSize={PAGE_SIZE}
                queryObject={raw}
                pagination
                search
              />
            </div>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button
              size="small"
              type="submit"
              isLoading={isPending}
              disabled={isPending}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
