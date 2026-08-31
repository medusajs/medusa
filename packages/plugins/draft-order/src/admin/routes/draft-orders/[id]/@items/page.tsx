import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Check, PencilSquare, Plus } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  createDataTableColumnHelper,
  CurrencyInput,
  DataTableRowSelectionState,
  Divider,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  Text,
  toast,
  Tooltip,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { matchSorter } from "match-sorter"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import type { AdminOrderPreviewLineItem } from "../../../../../types/http/orders/entity"
import { DataTable } from "../../../../components/common/data-table"
import { Form } from "../../../../components/common/form"
import { KeyboundForm } from "../../../../components/common/keybound-form"
import { Thumbnail } from "../../../../components/common/thumbnail"
import { NumberInput } from "../../../../components/inputs/number-input"
import {
  RouteFocusModal,
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../../../../components/modals"
import {
  useDraftOrder,
  useDraftOrderAddItems,
  useDraftOrderConfirmEdit,
  useDraftOrderRemoveActionItem,
  useDraftOrderRequestEdit,
  useDraftOrderUpdateActionItem,
  useDraftOrderUpdateItem,
} from "../../../../hooks/api/draft-orders"
import { useOrderPreview } from "../../../../hooks/api/orders"
import { useProductVariants } from "../../../../hooks/api/product-variants"
import { useDebouncedSearch } from "../../../../hooks/common/use-debounced-search"
import { useQueryParams } from "../../../../hooks/common/use-query-params"
import { useCancelOrderEdit } from "../../../../hooks/order-edits/use-cancel-order-edit"
import { useInitiateOrderEdit } from "../../../../hooks/order-edits/use-initiate-order-edit"
import {
  getLocaleAmount,
  getNativeSymbol,
  getStylizedAmount,
} from "../../../../lib/data/currencies"
import { getFullDate } from "../../../../lib/utils/date-utils"
import { convertNumber } from "../../../../lib/utils/number-utils"

const STACKED_MODAL_ID = "items_stacked_modal"

const Items = () => {
  const { id } = useParams()

  const {
    order: preview,
    isPending: isPreviewPending,
    isError: isPreviewError,
    error: previewError,
  } = useOrderPreview(id!, undefined, {
    placeholderData: keepPreviousData,
  })

  useInitiateOrderEdit({ preview })

  const { draft_order, isPending, isError, error } = useDraftOrder(
    id!,
    {
      fields: "currency_code",
    },
    {
      enabled: !!id,
    }
  )

  const { onCancel } = useCancelOrderEdit({ preview })

  if (isError) {
    throw error
  }

  if (isPreviewError) {
    throw previewError
  }

  const ready = !!preview && !isPreviewPending && !!draft_order && !isPending

  return (
    <RouteFocusModal onClose={onCancel}>
      {ready ? (
        <ItemsForm preview={preview} currencyCode={draft_order.currency_code} />
      ) : (
        <div>
          <RouteFocusModal.Title asChild>
            <span className="sr-only">Edit Items</span>
          </RouteFocusModal.Title>
          <RouteFocusModal.Description asChild>
            <span className="sr-only">
              Loading data for the draft order, please wait...
            </span>
          </RouteFocusModal.Description>
        </div>
      )}
    </RouteFocusModal>
  )
}

interface ItemsFormProps {
  preview: HttpTypes.AdminOrderPreview
  currencyCode: string
}

const ItemsForm = ({ preview, currencyCode }: ItemsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalContent, setModalContent] = useState<StackedModalContent | null>(
    null
  )

  const { handleSuccess } = useRouteModal()
  const { searchValue, onSearchValueChange, query } = useDebouncedSearch()

  const { mutateAsync: confirmOrderEdit } = useDraftOrderConfirmEdit(preview.id)
  const { mutateAsync: requestOrderEdit } = useDraftOrderRequestEdit(preview.id)

  const itemCount =
    preview.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const matches = useMemo(() => {
    return matchSorter(preview.items, query, {
      keys: ["product_title", "variant_title", "variant_sku", "title"],
    })
  }, [preview.items, query])

  const onSubmit = async () => {
    setIsSubmitting(true)

    let requestSucceeded = false

    await requestOrderEdit(undefined, {
      onError: (e) => {
        toast.error(`Failed to request order edit: ${e.message}`)
      },
      onSuccess: () => {
        requestSucceeded = true
      },
    })

    if (!requestSucceeded) {
      setIsSubmitting(false)
      return
    }

    await confirmOrderEdit(undefined, {
      onError: (e) => {
        toast.error(`Failed to confirm order edit: ${e.message}`)
      },
      onSuccess: () => {
        handleSuccess()
      },
      onSettled: () => {
        setIsSubmitting(false)
      },
    })
  }

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        if (modalContent || isSubmitting) {
          // Don't do anything if the StackedFocusModal is open or the form is submitting
          return
        }

        onSubmit()
      }
    },
    [modalContent, isSubmitting, onSubmit]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [onKeyDown])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
        <StackedFocusModal
          id={STACKED_MODAL_ID}
          onOpenChangeCallback={(open) => {
            if (!open) {
              setModalContent(null)
            }
          }}
        >
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-6 px-6 py-16">
              <div>
                <RouteFocusModal.Title asChild>
                  <Heading>Edit Items</Heading>
                </RouteFocusModal.Title>
                <RouteFocusModal.Description asChild>
                  <Text size="small" className="text-ui-fg-subtle">
                    Edit the items in the draft order
                  </Text>
                </RouteFocusModal.Description>
              </div>
              <Divider variant="dashed" />
              <div className="flex flex-col gap-y-6">
                <div className="grid grid-cols-2 items-center gap-3">
                  <div className="flex flex-col">
                    <Text size="small" weight="plus" leading="compact">
                      Items
                    </Text>
                    <Text size="small" className="text-ui-fg-subtle">
                      Choose items from the product catalog.
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        type="search"
                        placeholder="Search items"
                        value={searchValue}
                        onChange={(e) => onSearchValueChange(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <IconButton type="button">
                          <Plus />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <StackedModalTrigger
                          type={StackedModalContent.ADD_ITEMS}
                          setModalContent={setModalContent}
                        />
                        <StackedModalTrigger
                          type={StackedModalContent.ADD_CUSTOM_ITEM}
                          setModalContent={setModalContent}
                        />
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="bg-ui-bg-subtle shadow-elevation-card-rest rounded-xl">
                  <div className="px-[5px]">
                    <div className="text-ui-fg-muted grid grid-cols-[2fr_1fr_2fr_28px] gap-3 px-4 py-2">
                      <div>
                        <Text size="small" weight="plus">
                          Item
                        </Text>
                      </div>
                      <div>
                        <Text size="small" weight="plus">
                          Quantity
                        </Text>
                      </div>
                      <div className="text-right">
                        <Text size="small" weight="plus">
                          Price
                        </Text>
                      </div>
                      <div />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1.5 px-[5px] pb-[5px]">
                    {itemCount <= 0 ? (
                      <div className="bg-ui-bg-base shadow-elevation-card-rest flex flex-col items-center justify-center gap-1 gap-x-3 rounded-lg p-4">
                        <Text size="small" weight="plus" leading="compact">
                          There are no items in this order
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          Add items to the order to get started.
                        </Text>
                      </div>
                    ) : matches.length > 0 ? (
                      matches?.map((item) => (
                        <Item
                          key={item.id}
                          item={item}
                          preview={preview}
                          currencyCode={currencyCode}
                        />
                      ))
                    ) : (
                      <div className="bg-ui-bg-base shadow-elevation-card-rest flex flex-col items-center justify-center gap-1 gap-x-3 rounded-lg p-4">
                        <Text size="small" weight="plus" leading="compact">
                          No items found
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          No items found for "{query}".
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Divider variant="dashed" />
              <div className="grid grid-cols-[1fr_0.5fr_0.5fr] gap-3">
                <div>
                  <Text size="small" weight="plus" leading="compact">
                    Subtotal
                  </Text>
                </div>
                <div>
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-subtle"
                  >
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </Text>
                </div>
                <div className="text-right">
                  <Text size="small" weight="plus" leading="compact">
                    {getStylizedAmount(preview.item_subtotal, currencyCode)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
          {modalContent &&
            (modalContent === StackedModalContent.ADD_ITEMS ? (
              <ExistingItemsForm orderId={preview.id} items={preview.items} />
            ) : modalContent === StackedModalContent.ADD_CUSTOM_ITEM ? (
              <CustomItemForm
                orderId={preview.id}
                currencyCode={currencyCode}
              />
            ) : null)}
        </StackedFocusModal>
      </RouteFocusModal.Body>
      <RouteFocusModal.Footer>
        <div className="flex items-center justify-end gap-x-2">
          <RouteFocusModal.Close asChild>
            <Button size="small" variant="secondary" type="button">
              Cancel
            </Button>
          </RouteFocusModal.Close>
          <Button
            size="small"
            type="button"
            onClick={onSubmit}
            isLoading={isSubmitting}
          >
            Save
          </Button>
        </div>
      </RouteFocusModal.Footer>
    </div>
  )
}

interface ItemProps {
  item: AdminOrderPreviewLineItem
  preview: HttpTypes.AdminOrderPreview
  currencyCode: string
}

const Item = ({ item, preview, currencyCode }: ItemProps) => {
  if (item.variant_id) {
    return (
      <VariantItem item={item} preview={preview} currencyCode={currencyCode} />
    )
  }

  return (
    <CustomItem item={item} preview={preview} currencyCode={currencyCode} />
  )
}

const VariantItem = ({ item, preview, currencyCode }: ItemProps) => {
  const [editing, setEditing] = useState(false)

  const form = useForm<z.infer<typeof variantItemSchema>>({
    defaultValues: {
      quantity: item.quantity,
      unit_price: item.unit_price,
    },
    resolver: zodResolver(variantItemSchema),
  })

  const actionId = useMemo(() => {
    return item.actions?.find((a) => a.action === "ITEM_ADD")?.id
  }, [item])

  const { mutateAsync: updateActionItem, isPending: isUpdatingActionItem } =
    useDraftOrderUpdateActionItem(preview.id)
  const { mutateAsync: removeActionItem, isPending: isRemovingActionItem } =
    useDraftOrderRemoveActionItem(preview.id)
  const { mutateAsync: updateOriginalItem, isPending: isUpdatingOriginalItem } =
    useDraftOrderUpdateItem(preview.id)

  const isPending =
    isUpdatingActionItem || isUpdatingOriginalItem || isRemovingActionItem

  const onSubmit = form.handleSubmit(async (data) => {
    /**
     * If none of the values have changed, we don't need to update anything
     */
    if (
      convertNumber(data.unit_price) === item.unit_price &&
      data.quantity === item.quantity
    ) {
      setEditing(false)

      return
    }

    if (!actionId) {
      await updateOriginalItem(
        {
          item_id: item.id,
          quantity: data.quantity,
          unit_price: convertNumber(data.unit_price),
        },
        {
          onSuccess: () => {
            setEditing(false)
          },
          onError: (e) => {
            toast.error(e.message)
          },
        }
      )

      return
    }

    if (data.quantity === 0) {
      await removeActionItem(actionId, {
        onSuccess: () => {
          setEditing(false)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      })

      return
    }

    await updateActionItem(
      {
        action_id: actionId,
        quantity: data.quantity,
        unit_price: convertNumber(data.unit_price),
      },
      {
        onSuccess: () => {
          setEditing(false)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="bg-ui-bg-base shadow-elevation-card-rest grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)_28px] items-center gap-3 rounded-lg px-4 py-2">
          <div className="flex w-full items-center gap-x-3">
            <Thumbnail
              thumbnail={item.thumbnail}
              alt={item.product_title ?? undefined}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-x-1">
                <Text size="small" weight="plus" leading="compact">
                  {item.product_title}
                </Text>
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  ({item.variant_title})
                </Text>
              </div>
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                {item.variant_sku}
              </Text>
            </div>
          </div>
          {editing ? (
            <div className="w-full flex-1">
              <Form.Field
                control={form.control}
                name="quantity"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <NumberInput {...field} />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            </div>
          ) : (
            <div className="w-full flex-1">
              <Text size="small" weight="plus">
                {item.quantity}
              </Text>
            </div>
          )}
          {editing ? (
            <div className="w-full flex-1">
              <Form.Field
                control={form.control}
                name="unit_price"
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <CurrencyInput
                          {...field}
                          symbol={getNativeSymbol(currencyCode)}
                          code={currencyCode}
                          onValueChange={(_value, _name, values) =>
                            onChange(values?.value)
                          }
                        />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            </div>
          ) : (
            <div className="flex w-full flex-1 items-center justify-end">
              <Text size="small" weight="plus">
                {getLocaleAmount(item.unit_price, currencyCode)}
              </Text>
            </div>
          )}
          <IconButton
            type="button"
            size="small"
            onClick={
              editing
                ? onSubmit
                : () => {
                    setEditing(true)
                  }
            }
            disabled={isPending}
          >
            {editing ? <Check /> : <PencilSquare />}
          </IconButton>
        </div>
      </form>
    </Form>
  )
}

const variantItemSchema = z.object({
  quantity: z.number(),
  unit_price: z.union([z.number(), z.string()]),
})

const CustomItem = ({ item, preview, currencyCode }: ItemProps) => {
  const [editing, setEditing] = useState(false)
  const { quantity, unit_price, title } = item

  const form = useForm<z.infer<typeof customItemSchema>>({
    defaultValues: {
      title,
      quantity,
      unit_price,
    },
    resolver: zodResolver(customItemSchema),
  })

  useEffect(() => {
    form.reset({
      title,
      quantity,
      unit_price,
    })
  }, [form, title, quantity, unit_price])

  const actionId = useMemo(() => {
    return item.actions?.find((a) => a.action === "ITEM_ADD")?.id
  }, [item])

  const { mutateAsync: updateActionItem, isPending: isUpdatingActionItem } =
    useDraftOrderUpdateActionItem(preview.id)

  const { mutateAsync: removeActionItem, isPending: isRemovingActionItem } =
    useDraftOrderRemoveActionItem(preview.id)

  const { mutateAsync: updateOriginalItem, isPending: isUpdatingOriginalItem } =
    useDraftOrderUpdateItem(preview.id)

  const isPending = isUpdatingActionItem || isUpdatingOriginalItem

  const onSubmit = form.handleSubmit(async (data) => {
    /**
     * If none of the values have changed, we don't need to update anything
     */
    if (
      convertNumber(data.unit_price) === item.unit_price &&
      data.quantity === item.quantity &&
      data.title === item.title
    ) {
      setEditing(false)

      return
    }

    if (!actionId) {
      await updateOriginalItem(
        {
          item_id: item.id,
          quantity: data.quantity,
          unit_price: convertNumber(data.unit_price),
        },
        {
          onSuccess: () => {
            setEditing(false)
          },
          onError: (e) => {
            toast.error(e.message)
          },
        }
      )

      return
    }

    if (data.quantity === 0) {
      await removeActionItem(actionId, {
        onSuccess: () => {
          setEditing(false)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      })

      return
    }

    await updateActionItem(
      {
        action_id: actionId,
        quantity: data.quantity,
        unit_price: convertNumber(data.unit_price),
      },
      {
        onSuccess: () => {
          setEditing(false)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="bg-ui-bg-base shadow-elevation-card-rest grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)_28px] items-center gap-3 rounded-lg px-4 py-2">
          <div className="flex items-center gap-x-3">
            <Thumbnail
              thumbnail={item.thumbnail}
              alt={item.title ?? undefined}
            />
            {editing ? (
              <Form.Field
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            ) : (
              <Text size="small" weight="plus">
                {item.title}
              </Text>
            )}
          </div>
          {editing ? (
            <Form.Field
              control={form.control}
              name="quantity"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <NumberInput {...field} />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
          ) : (
            <Text size="small" weight="plus">
              {item.quantity}
            </Text>
          )}
          {editing ? (
            <Form.Field
              control={form.control}
              name="unit_price"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <CurrencyInput
                        {...field}
                        symbol={getNativeSymbol(currencyCode)}
                        code={currencyCode}
                        onValueChange={(_value, _name, values) =>
                          onChange(values?.value)
                        }
                      />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
          ) : (
            <div className="flex flex-1 items-center justify-end">
              <Text size="small" weight="plus">
                {getLocaleAmount(item.unit_price, currencyCode)}
              </Text>
            </div>
          )}
          <IconButton
            type="button"
            size="small"
            onClick={
              editing
                ? onSubmit
                : () => {
                    setEditing(true)
                  }
            }
            disabled={isPending}
          >
            {editing ? <Check /> : <PencilSquare />}
          </IconButton>
        </div>
      </form>
    </Form>
  )
}

enum StackedModalContent {
  ADD_ITEMS = "add-items",
  ADD_CUSTOM_ITEM = "add-custom-item",
}

interface StackedModalTriggerProps {
  type: StackedModalContent
  setModalContent: (content: StackedModalContent) => void
}

const StackedModalTrigger = ({
  type,
  setModalContent,
}: StackedModalTriggerProps) => {
  const { setIsOpen } = useStackedModal()

  const onClick = useCallback(() => {
    setModalContent(type)
    setIsOpen(STACKED_MODAL_ID, true)
  }, [setModalContent, setIsOpen, type])

  return (
    <StackedFocusModal.Trigger asChild>
      <DropdownMenu.Item onClick={onClick}>
        {type === StackedModalContent.ADD_ITEMS
          ? "Add items"
          : "Add custom item"}
      </DropdownMenu.Item>
    </StackedFocusModal.Trigger>
  )
}

const VARIANT_PREFIX = "items"
const LIMIT = 50

interface ExistingItemsFormProps {
  orderId: string
  items: AdminOrderPreviewLineItem[]
}

const ExistingItemsForm = ({ orderId, items }: ExistingItemsFormProps) => {
  const { setIsOpen } = useStackedModal()
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    items.reduce((acc, item) => {
      acc[item.variant_id!] = true

      return acc
    }, {} as DataTableRowSelectionState)
  )

  useEffect(() => {
    setRowSelection(
      items.reduce((acc, item) => {
        if (item.variant_id) {
          acc[item.variant_id!] = true
        }

        return acc
      }, {} as DataTableRowSelectionState)
    )
  }, [items])

  const { q, order, offset } = useQueryParams(
    ["q", "order", "offset"],
    VARIANT_PREFIX
  )
  const { variants, count, isPending, isError, error } = useProductVariants(
    {
      q,
      order,
      offset: offset ? parseInt(offset) : undefined,
      limit: LIMIT,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()

  const { mutateAsync } = useDraftOrderAddItems(orderId)

  const onSubmit = async () => {
    const ids = Object.keys(rowSelection).filter(
      (id) => !items.find((i) => i.variant_id === id)
    )

    await mutateAsync(
      {
        items: ids.map((id) => ({
          variant_id: id,
          quantity: 1,
        })),
      },
      {
        onSuccess: () => {
          setRowSelection({})
          setIsOpen(STACKED_MODAL_ID, false)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  if (isError) {
    throw error
  }

  return (
    <StackedFocusModal.Content
      onOpenAutoFocus={(e) => {
        e.preventDefault()

        const searchInput = document.querySelector(
          "[data-modal-id='modal-search-input']"
        )

        if (searchInput) {
          ;(searchInput as HTMLInputElement).focus()
        }
      }}
    >
      <StackedFocusModal.Header>
        <StackedFocusModal.Title asChild>
          <span className="sr-only">Product Variants</span>
        </StackedFocusModal.Title>
        <StackedFocusModal.Description asChild>
          <span className="sr-only">
            Choose product variants to add to the order.
          </span>
        </StackedFocusModal.Description>
      </StackedFocusModal.Header>
      <StackedFocusModal.Body className="flex-1 overflow-hidden">
        <DataTable
          data={variants}
          columns={columns}
          isLoading={isPending}
          getRowId={(row) => row.id}
          rowCount={count}
          prefix={VARIANT_PREFIX}
          layout="fill"
          rowSelection={{
            state: rowSelection,
            onRowSelectionChange: setRowSelection,
            enableRowSelection: (row) => {
              return !items.find((i) => i.variant_id === row.original.id)
            },
          }}
          autoFocusSearch={true}
        />
      </StackedFocusModal.Body>
      <StackedFocusModal.Footer>
        <div className="flex items-center justify-end gap-x-2">
          <StackedFocusModal.Close asChild>
            <Button size="small" variant="secondary" type="button">
              Cancel
            </Button>
          </StackedFocusModal.Close>
          <Button size="small" type="button" onClick={onSubmit}>
            Update items
          </Button>
        </div>
      </StackedFocusModal.Footer>
    </StackedFocusModal.Content>
  )
}

const columnHelper =
  createDataTableColumnHelper<HttpTypes.AdminProductVariant>()

const useColumns = () => {
  return useMemo(() => {
    return [
      columnHelper.select(),
      columnHelper.accessor("product.title", {
        header: "Product",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-x-2">
              <Thumbnail
                thumbnail={row.original.product?.thumbnail}
                alt={row.original.product?.title}
              />
              <span>{row.original.product?.title}</span>
            </div>
          )
        },
        enableSorting: true,
      }),
      columnHelper.accessor("title", {
        header: "Variant",
        enableSorting: true,
      }),
      columnHelper.accessor("sku", {
        header: "SKU",
        cell: ({ getValue }) => {
          return getValue() ?? "-"
        },
        enableSorting: true,
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated",
        cell: ({ getValue }) => {
          return (
            <Tooltip
              content={getFullDate({ date: getValue(), includeTime: true })}
            >
              <span>{getFullDate({ date: getValue() })}</span>
            </Tooltip>
          )
        },
        enableSorting: true,
        sortAscLabel: "Oldest first",
        sortDescLabel: "Newest first",
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: ({ getValue }) => {
          return (
            <Tooltip
              content={getFullDate({ date: getValue(), includeTime: true })}
            >
              <span>{getFullDate({ date: getValue() })}</span>
            </Tooltip>
          )
        },
        enableSorting: true,
        sortAscLabel: "Oldest first",
        sortDescLabel: "Newest first",
      }),
    ]
  }, [])
}

interface CustomItemFormProps {
  orderId: string
  currencyCode: string
}

const CustomItemForm = ({ orderId, currencyCode }: CustomItemFormProps) => {
  const { setIsOpen } = useStackedModal()
  const { mutateAsync: addItems } = useDraftOrderAddItems(orderId)

  const form = useForm<z.infer<typeof customItemSchema>>({
    defaultValues: {
      title: "",
      quantity: 1,
      unit_price: "",
    },
    resolver: zodResolver(customItemSchema),
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await addItems(
      {
        items: [
          {
            title: data.title,
            quantity: data.quantity,
            unit_price: convertNumber(data.unit_price),
          },
        ],
      },
      {
        onSuccess: () => {
          setIsOpen(STACKED_MODAL_ID, false)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <Form {...form}>
      <KeyboundForm onSubmit={onSubmit}>
        <StackedFocusModal.Content>
          <StackedFocusModal.Header />
          <StackedFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col items-center overflow-y-auto">
              <div className="flex w-full max-w-[720px] flex-col gap-y-6 px-2 py-16">
                <div>
                  <StackedFocusModal.Title asChild>
                    <Heading>Add custom item</Heading>
                  </StackedFocusModal.Title>
                  <StackedFocusModal.Description asChild>
                    <Text size="small" className="text-ui-fg-subtle">
                      Add a custom item to the order. This will add a new line
                      item that is not associated with an existing product.
                    </Text>
                  </StackedFocusModal.Description>
                </div>
                <Divider variant="dashed" />
                <Form.Field
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <Form.Item>
                      <div className="grid grid-cols-2 gap-x-3">
                        <div>
                          <Form.Label>Title</Form.Label>
                          <Form.Hint>Enter the title of the item</Form.Hint>
                        </div>
                        <div>
                          <Form.Control>
                            <Input {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </div>
                      </div>
                    </Form.Item>
                  )}
                />
                <Divider variant="dashed" />
                <Form.Field
                  control={form.control}
                  name="unit_price"
                  render={({ field: { onChange, ...field } }) => (
                    <Form.Item>
                      <div className="grid grid-cols-2 gap-x-3">
                        <div>
                          <Form.Label>Unit price</Form.Label>
                          <Form.Hint>
                            Enter the unit price of the item
                          </Form.Hint>
                        </div>
                        <div>
                          <Form.Control>
                            <CurrencyInput
                              symbol={getNativeSymbol(currencyCode)}
                              code={currencyCode}
                              onValueChange={(_value, _name, values) =>
                                onChange(values?.value)
                              }
                              {...field}
                            />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </div>
                      </div>
                    </Form.Item>
                  )}
                />
                <Divider variant="dashed" />
                <Form.Field
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <Form.Item>
                      <div className="grid grid-cols-2 gap-x-3">
                        <div>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Hint>Enter the quantity of the item</Form.Hint>
                        </div>
                        <div className="w-full flex-1">
                          <Form.Control>
                            <div className="w-full flex-1">
                              <NumberInput {...field} className="w-full" />
                            </div>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </div>
                      </div>
                    </Form.Item>
                  )}
                />
              </div>
            </div>
          </StackedFocusModal.Body>
          <StackedFocusModal.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <StackedFocusModal.Close asChild>
                <Button size="small" variant="secondary" type="button">
                  Cancel
                </Button>
              </StackedFocusModal.Close>
              <Button size="small" type="button" onClick={onSubmit}>
                Add item
              </Button>
            </div>
          </StackedFocusModal.Footer>
        </StackedFocusModal.Content>
      </KeyboundForm>
    </Form>
  )
}

const customItemSchema = z.object({
  title: z.string().min(1),
  quantity: z.number(),
  unit_price: z.union([z.number(), z.string()]),
})

export default Items
