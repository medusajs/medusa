import { XMark } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import {
  Button,
  clx,
  Divider,
  Heading,
  Hint,
  IconButton,
  Label,
  Text,
  toast,
} from "@zjedene-medusa/ui"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { KeyboundForm } from "../../../../components/common/keybound-form"
import { Combobox } from "../../../../components/inputs/combobox"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import {
  useDraftOrderAddPromotions,
  useDraftOrderConfirmEdit,
  useDraftOrderRemovePromotions,
} from "../../../../hooks/api/draft-orders"
import {
  useOrderEditRequest,
  useOrderPreview,
} from "../../../../hooks/api/orders"
import { usePromotions } from "../../../../hooks/api/promotions"
import { useComboboxData } from "../../../../hooks/common/use-combobox-data"
import { useCancelOrderEdit } from "../../../../hooks/order-edits/use-cancel-order-edit"
import { useInitiateOrderEdit } from "../../../../hooks/order-edits/use-initiate-order-edit"
import { getLocaleAmount } from "../../../../lib/data/currencies"
import { sdk } from "../../../../lib/queries/sdk"

const Promotions = () => {
  const { id } = useParams()

  const {
    order: preview,
    isError: isPreviewError,
    error: previewError,
  } = useOrderPreview(id!, undefined)

  useInitiateOrderEdit({ preview })

  const { onCancel } = useCancelOrderEdit({ preview })

  if (isPreviewError) {
    throw previewError
  }

  const isReady = !!preview

  return (
    <RouteDrawer onClose={onCancel}>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Edit Promotions</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>
      {isReady && <PromotionForm preview={preview} />}
    </RouteDrawer>
  )
}

interface PromotionFormProps {
  preview: HttpTypes.AdminOrderPreview
}

const PromotionForm = ({ preview }: PromotionFormProps) => {
  const { items, shipping_methods } = preview

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comboboxValue, setComboboxValue] = useState("")

  const { handleSuccess } = useRouteModal()

  const { mutateAsync: addPromotions, isPending: isAddingPromotions } =
    useDraftOrderAddPromotions(preview.id)

  const promoIds = getPromotionIds(items, shipping_methods)

  const { promotions, isPending, isError, error } = usePromotions(
    {
      id: promoIds,
    },
    {
      enabled: !!promoIds.length,
    }
  )

  const comboboxData = useComboboxData({
    queryKey: ["promotions", "combobox", promoIds],
    queryFn: async (params) => {
      return await sdk.admin.promotion.list({
        ...params,
        id: {
          $nin: promoIds,
        },
      })
    },
    getOptions: (data) => {
      return data.promotions.map((promotion) => ({
        label: promotion.code!,
        value: promotion.code!,
      }))
    },
  })

  const add = async (value?: string) => {
    if (!value) {
      return
    }

    addPromotions(
      {
        promo_codes: [value],
      },
      {
        onError: (e) => {
          toast.error(e.message)
          comboboxData.onSearchValueChange("")
          setComboboxValue("")
        },
        onSuccess: () => {
          comboboxData.onSearchValueChange("")
          setComboboxValue("")
        },
      }
    )
  }

  const { mutateAsync: confirmOrderEdit } = useDraftOrderConfirmEdit(preview.id)
  const { mutateAsync: requestOrderEdit } = useOrderEditRequest(preview.id)

  const onSubmit = async () => {
    setIsSubmitting(true)

    let requestSucceeded = false

    await requestOrderEdit(undefined, {
      onError: (e) => {
        toast.error(e.message)
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
        toast.error(e.message)
      },
      onSuccess: () => {
        handleSuccess()
      },
      onSettled: () => {
        setIsSubmitting(false)
      },
    })
  }

  if (isError) {
    throw error
  }

  return (
    <KeyboundForm className="flex flex-1 flex-col" onSubmit={onSubmit}>
      <RouteDrawer.Body>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <Label size="small" weight="plus" htmlFor="promotion-combobox">
                Apply promotions
              </Label>
              <Hint id="promotion-combobox-hint">
                Manage promotions that should be applied to the order.
              </Hint>
            </div>
            <Combobox
              id="promotion-combobox"
              aria-describedby="promotion-combobox-hint"
              isFetchingNextPage={comboboxData.isFetchingNextPage}
              fetchNextPage={comboboxData.fetchNextPage}
              options={comboboxData.options}
              onSearchValueChange={comboboxData.onSearchValueChange}
              searchValue={comboboxData.searchValue}
              disabled={comboboxData.disabled || isAddingPromotions}
              onChange={add}
              value={comboboxValue}
            />
          </div>
          <Divider variant="dashed" />
          <div className="flex flex-col gap-2">
            {promotions?.map((promotion) => (
              <PromotionItem
                key={promotion.id}
                promotion={promotion}
                orderId={preview.id}
                isLoading={isPending}
              />
            ))}
          </div>
        </div>
      </RouteDrawer.Body>
      <RouteDrawer.Footer>
        <div className="flex justify-end gap-2">
          <RouteDrawer.Close asChild>
            <Button size="small" variant="secondary">
              Cancel
            </Button>
          </RouteDrawer.Close>
          <Button
            size="small"
            type="submit"
            isLoading={isSubmitting || isAddingPromotions}
          >
            Save
          </Button>
        </div>
      </RouteDrawer.Footer>
    </KeyboundForm>
  )
}

interface PromotionItemProps {
  promotion: HttpTypes.AdminPromotion
  orderId: string
  isLoading: boolean
}

const PromotionItem = ({
  promotion,
  orderId,
  isLoading,
}: PromotionItemProps) => {
  const { mutateAsync: removePromotions, isPending } =
    useDraftOrderRemovePromotions(orderId)

  const onRemove = async () => {
    removePromotions(
      {
        promo_codes: [promotion.code!],
      },
      {
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  const displayValue = getDisplayValue(promotion)

  return (
    <div
      key={promotion.id}
      className={clx(
        "bg-ui-bg-component shadow-elevation-card-rest flex items-center justify-between rounded-lg px-3 py-2",
        {
          "animate-pulse": isLoading,
        }
      )}
    >
      <div>
        <Text size="small" weight="plus" leading="compact">
          {promotion.code}
        </Text>
        <div className="text-ui-fg-subtle flex items-center gap-1.5">
          {displayValue && (
            <div className="flex items-center gap-1.5">
              <Text size="small" leading="compact">
                {displayValue}
              </Text>
              <Text size="small" leading="compact">
                ·
              </Text>
            </div>
          )}
          <Text size="small" leading="compact" className="capitalize">
            {promotion.application_method?.allocation!}
          </Text>
        </div>
      </div>
      <IconButton
        size="small"
        type="button"
        variant="transparent"
        onClick={onRemove}
        isLoading={isPending || isLoading}
      >
        <XMark />
      </IconButton>
    </div>
  )
}

function getDisplayValue(promotion: HttpTypes.AdminPromotion) {
  const value = promotion.application_method?.value

  if (!value) {
    return null
  }

  if (promotion.application_method?.type === "fixed") {
    const currency = promotion.application_method?.currency_code

    if (!currency) {
      return null
    }

    return getLocaleAmount(value, currency)
  } else if (promotion.application_method?.type === "percentage") {
    return formatPercentage(value)
  }

  return null
}

const formatter = new Intl.NumberFormat([], {
  style: "percent",
  minimumFractionDigits: 2,
})

const formatPercentage = (value?: number | null, isPercentageValue = false) => {
  let val = value || 0

  if (!isPercentageValue) {
    val = val / 100
  }

  return formatter.format(val)
}

function getPromotionIds(
  items: HttpTypes.AdminOrderPreview["items"],
  shippingMethods: HttpTypes.AdminOrderPreview["shipping_methods"]
) {
  const promotionIds = new Set<string>()

  for (const item of items) {
    if (item.adjustments) {
      for (const adjustment of item.adjustments) {
        if (adjustment.promotion_id) {
          promotionIds.add(adjustment.promotion_id)
        }
      }
    }
  }

  for (const shippingMethod of shippingMethods) {
    if (shippingMethod.adjustments) {
      for (const adjustment of shippingMethod.adjustments) {
        if (adjustment.promotion_id) {
          promotionIds.add(adjustment.promotion_id)
        }
      }
    }
  }

  return Array.from(promotionIds)
}

export default Promotions
