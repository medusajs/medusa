import { Order, Return } from "@medusajs/medusa"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { nestedForm } from "../../../../utils/nested-form"
import { ReceiveReturnFormType } from "../../details/receive-return/receive-return-menu"
import RefundAmountForm from "../refund-amount-form"
import { SummaryLineItem } from "./summary-line-item"
import { SummaryShippingLine } from "./summary-shipping-line"

type Props = {
  form: UseFormReturn<ReceiveReturnFormType>
  returnRequest: Return
  order: Order
}

export const ReceiveReturnSummary = ({ form, order, returnRequest }: Props) => {
  const { control } = form

  const items = useWatch({
    control,
    name: "receive_items.items",
  })

  const itemToReceive = useMemo(() => {
    return items.filter((i) => i.receive)
  }, [items])

  const itemSubTotal = useMemo(() => {
    return items
      .filter((i) => i.receive)
      .reduce((acc, item) => {
        return acc + item.price * item.quantity
      }, 0)
  }, [items])

  const shipping = useMemo(() => {
    // If the return is part of a claim, we do not want to display the shipping
    if (!returnRequest.shipping_method || returnRequest.claim_order_id) {
      return null
    }

    const taxRate = returnRequest.shipping_method.tax_lines.reduce(
      (acc, tax) => {
        return acc + tax.rate / 100
      },
      0
    )

    /**
     * If we have passed a custom price to the shipping method, as
     * part of creating a return using the return menu, we have made
     * made tax calculations on the frontend. We therefore need to
     * reverse the tax calculation to get the correct price.
     *
     * @TODO This is a temporary solution, and should be removed
     * as all tax calculations should be done on the backend.
     */
    const priceInclTax = Math.round(
      returnRequest.shipping_method.price * (1 + taxRate)
    )

    return {
      priceInclTax,
      title: returnRequest.shipping_method.shipping_option.name,
    }
  }, [returnRequest])

  if (itemToReceive.length === 0) {
    return null
  }

  return (
    <div className="inter-base-regular">
      <div className="flex flex-col gap-y-base border-y border-grey-20 py-large">
        {itemToReceive.length > 0 && (
          <div>
            <p className="inter-base-semibold mb-small">Receiving</p>
            <div className="flex flex-col gap-y-xsmall">
              {itemToReceive.map((item, index) => {
                return (
                  <SummaryLineItem
                    key={index}
                    currencyCode={order.currency_code}
                    productTitle={item.product_title}
                    quantity={item.quantity}
                    price={item.price}
                    total={item.price * item.quantity}
                    variantTitle={item.variant_title}
                    thumbnail={item.thumbnail}
                  />
                )
              })}
              {shipping && (
                <SummaryShippingLine
                  currencyCode={order.currency_code}
                  title={shipping.title}
                  price={shipping.priceInclTax}
                  type="return"
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-y-xsmall pt-large">
        <div
          className="inter-large-semibold flex items-center justify-between"
          data-testid="refund-amount-container"
        >
          <p className="inter-base-semibold">Refund amount</p>
          <RefundAmountForm
            form={nestedForm(form, "refund_amount")}
            order={order}
            initialValue={itemSubTotal - (shipping?.priceInclTax || 0)}
          />
        </div>
      </div>
    </div>
  )
}
