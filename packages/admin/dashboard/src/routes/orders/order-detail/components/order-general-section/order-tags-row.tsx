import { XMarkMini } from "@medusajs/icons"
import { Badge, toast } from "@medusajs/ui"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  orderTagsQueryKeys,
  useBulkTagOrders,
  useCreateOrderTag,
} from "../../../../../hooks/api/order-tags"
import { ordersQueryKeys } from "../../../../../hooks/api/orders"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { ExtendedOrder } from "../../constants"

type OrderTagsRowProps = {
  order: ExtendedOrder
}

export const OrderTagsRow = ({ order }: OrderTagsRowProps) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  // The combobox is a one-shot "add" control, not a persistent multi-select -
  // the current tags are shown as badges above it, so we always reset this
  // back to an empty string after an add/create action.
  const [comboboxValue, setComboboxValue] = useState("")

  const tagOptions = useComboboxData({
    queryKey: orderTagsQueryKeys.lists(),
    queryFn: (params) => sdk.admin.orderTags.list(params),
    getOptions: (data) =>
      data.order_tags.map((tag) => ({
        label: tag.value,
        value: tag.id,
      })),
  })

  // `useBulkTagOrders`/`useCreateOrderTag` already invalidate the orders list
  // and order-tags list query keys (see order-tags.ts), but the open order
  // detail page reads from `ordersQueryKeys.detail(id)`, which is a separate
  // key that those hooks don't cover. Invalidate it here too so the badges
  // reflect the change immediately without a manual refetch.
  const invalidateOrderDetail = () => {
    queryClient.invalidateQueries({
      queryKey: ordersQueryKeys.detail(order.id),
    })
  }

  const { mutateAsync: bulkTagOrders } = useBulkTagOrders({
    onSuccess: () => {
      invalidateOrderDetail()
    },
    onError: (e) => {
      toast.error(e.message)
    },
  })

  const { mutateAsync: createOrderTag } = useCreateOrderTag({
    onError: (e) => {
      toast.error(e.message)
    },
  })

  const handleRemoveTag = async (tagId: string) => {
    await bulkTagOrders({
      order_ids: [order.id],
      remove: [tagId],
    })
  }

  const handleSelectExistingTag = async (tagId?: string) => {
    // The combobox's internal handleValueChange always calls onChange with
    // the raw typed value, even on the create path (right after invoking
    // onCreateOption). Only treat this as an existing-tag selection when the
    // id actually matches one of the known tag options - otherwise a newly
    // typed value would also fire a bulk-tag call with a bogus id.
    const isKnownTag = tagOptions.options.some(
      (option) => option.value === tagId
    )

    if (!tagId || !isKnownTag) {
      return
    }

    await bulkTagOrders({
      order_ids: [order.id],
      add: [tagId],
    })

    setComboboxValue("")
  }

  const handleCreateTag = async (typedValue: string) => {
    const value = typedValue.trim()

    if (!value) {
      return
    }

    const { order_tag } = await createOrderTag({ value })

    await bulkTagOrders({
      order_ids: [order.id],
      add: [order_tag.id],
    })

    setComboboxValue("")
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {order.tags?.map((tag) => (
        <Badge
          key={tag.id}
          size="2xsmall"
          className="transition-fg flex max-w-full items-center gap-x-0.5 overflow-hidden pl-1.5 pr-1"
        >
          <span className="truncate">{tag.value}</span>
          <button
            type="button"
            onClick={() => handleRemoveTag(tag.id)}
            className="text-ui-fg-subtle transition-fg shrink-0 outline-none"
          >
            <XMarkMini />
          </button>
        </Badge>
      ))}
      <Combobox
        value={comboboxValue}
        onChange={handleSelectExistingTag}
        options={tagOptions.options}
        searchValue={tagOptions.searchValue}
        onSearchValueChange={tagOptions.onSearchValueChange}
        fetchNextPage={tagOptions.fetchNextPage}
        isFetchingNextPage={tagOptions.isFetchingNextPage}
        shouldAlwaysShowCreateOption
        onCreateOption={handleCreateTag}
        placeholder={t("orders.tags.placeholder")}
        className="w-[180px]"
      />
    </div>
  )
}
