import { Order } from "@medusajs/medusa"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import { nestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { CreateClaimFormType } from "../../details/claim/register-claim-menu"
import RefundAmountForm from "../refund-amount-form"
import { SummaryLineItem } from "./summary-line-item"
import { SummaryShippingLine } from "./summary-shipping-line"

type Props = {
  form: UseFormReturn<CreateClaimFormType, any>
  order: Order
}

export const ClaimSummary = ({ form, order }: Props) => {
  const { control } = form

  const claimItems = useWatch({
    control: control,
    name: "return_items.items",
    defaultValue: [],
  })

  const selectedClaimItems = useMemo(() => {
    return claimItems.filter((item) => item.return)
  }, [claimItems])

  const claimItemShipping = useWatch({
    control: control,
    name: "return_shipping",
  })

  const replacementItems = useWatch({
    control: control,
    name: "additional_items.items",
    defaultValue: [],
  })

  const replacementItemShipping = useWatch({
    control: control,
    name: "replacement_shipping",
  })

  const claimType = useWatch({
    control: control,
    name: "claim_type.type",
  })

  const refundAmount = useMemo(() => {
    const claimItemsRefund = selectedClaimItems.reduce((acc, item) => {
      return acc + (item.total / item.original_quantity) * item.quantity
    }, 0)

    return {
      total:
        claimItemsRefund < 0
          ? formatAmountWithSymbol({
              amount: 0,
              currency: order.currency_code,
            })
          : formatAmountWithSymbol({
              amount: claimItemsRefund,
              currency: order.currency_code,
            }),
      totalAsNumber: claimItemsRefund < 0 ? 0 : claimItemsRefund,
    }
  }, [selectedClaimItems, order.currency_code])

  if (!(selectedClaimItems?.length > 0 || replacementItems?.length > 0)) {
    return null
  }

  return (
    <div className="inter-base-regular">
      <div className="gap-y-base border-grey-20 py-large flex flex-col border-y">
        {selectedClaimItems.length > 0 && (
          <div>
            <p className="inter-base-semibold mb-small">Claimed items</p>
            <div className="gap-y-xsmall flex flex-col">
              {selectedClaimItems.map((item, index) => {
                return (
                  <SummaryLineItem
                    key={index}
                    currencyCode={order.currency_code}
                    productTitle={item.product_title}
                    quantity={item.quantity}
                    sku={item.sku}
                    price={item.total / item.original_quantity}
                    total={
                      (item.total / item.original_quantity) * item.quantity
                    }
                    variantTitle={item.variant_title}
                    thumbnail={item.thumbnail}
                  />
                )
              })}
              {claimItemShipping.option && (
                <SummaryShippingLine
                  currencyCode={order.currency_code}
                  price={claimItemShipping.price}
                  title={claimItemShipping.option.label}
                  type="return"
                />
              )}
            </div>
          </div>
        )}
        {claimType !== "refund" && replacementItems.length > 0 && (
          <div>
            <div className="mb-small gap-x-2xsmall flex items-center">
              <p className="inter-base-semibold">Replacement items</p>
              <IconTooltip
                type="warning"
                content={
                  "The customer will receive a full refund for the claimed items, as the cost of replacement items and shipping will not be deducted. Alternatively, you can choose to set a custom refund amount when you receive the returned items or create an exchange instead."
                }
              />
            </div>
            <div className="gap-y-xsmall flex flex-col">
              {replacementItems.map((item, index) => {
                return (
                  <SummaryLineItem
                    key={index}
                    currencyCode={order.currency_code}
                    productTitle={item.product_title}
                    quantity={item.quantity}
                    sku={item.sku}
                    price={item.price}
                    total={item.price * item.quantity}
                    variantTitle={item.variant_title}
                    thumbnail={item.thumbnail}
                    isFree
                  />
                )
              })}
              {replacementItemShipping?.option && (
                <SummaryShippingLine
                  currencyCode={order.currency_code}
                  price={replacementItemShipping.price}
                  title={replacementItemShipping.option.label}
                  type="replacement"
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="pt-large">
        <div
          className="inter-large-semibold flex items-center justify-between"
          data-testid="refund-amount-container"
        >
          <div className="gap-x-2xsmall flex items-center">
            <p className="inter-base-semibold">Refund amount</p>
            <IconTooltip
              type="info"
              content={
                claimType === "replace" && claimItemShipping.option
                  ? "The customer will be refunded once the returned items are received"
                  : "The customer will be refunded immediately"
              }
            />
          </div>
          <div className="flex items-center">
            {claimType === "refund" ? (
              <RefundAmountForm
                form={nestedForm(form, "refund_amount")}
                order={order}
                initialValue={refundAmount.totalAsNumber}
              />
            ) : (
              <p>{refundAmount.total}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
