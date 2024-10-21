import { CheckCircleSolid, SquareTwoStack } from "@medusajs/icons"
import { AdminOrder, AdminPaymentCollection } from "@medusajs/types"
import { Button, Tooltip } from "@medusajs/ui"
import copy from "copy-to-clipboard"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { MEDUSA_STOREFRONT_URL } from "../../../../../lib/storefront"

type CopyPaymentLinkProps = {
  paymentCollection: AdminPaymentCollection
  order: AdminOrder
}

/**
 * This component is based on the `button` element and supports all of its props
 */
const CopyPaymentLink = React.forwardRef<any, CopyPaymentLinkProps>(
  ({ paymentCollection, order }: CopyPaymentLinkProps, ref) => {
    const [done, setDone] = useState(false)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("CopyPaymentLink")
    const { t } = useTranslation()

    const copyToClipboard = async (
      e:
        | React.MouseEvent<HTMLElement, MouseEvent>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation()

      setDone(true)
      copy(
        `${MEDUSA_STOREFRONT_URL}/payment-collection/${paymentCollection.id}`
      )

      setTimeout(() => {
        setDone(false)
      }, 2000)
    }

    React.useEffect(() => {
      if (done) {
        setText(t("actions.copied"))
        return
      }

      setTimeout(() => {
        setText(t("actions.copy"))
      }, 500)
    }, [done])

    return (
      <Tooltip content={text} open={done || open} onOpenChange={setOpen}>
        <Button
          ref={ref}
          variant="secondary"
          size="small"
          aria-label="CopyPaymentLink code snippet"
          onClick={copyToClipboard}
        >
          {done ? (
            <CheckCircleSolid className="inline" />
          ) : (
            <SquareTwoStack className="inline" />
          )}
          {t("orders.payment.paymentLink", {
            amount: getStylizedAmount(
              paymentCollection.amount as number,
              order?.currency_code
            ),
          })}
        </Button>
      </Tooltip>
    )
  }
)
CopyPaymentLink.displayName = "CopyPaymentLink"

export { CopyPaymentLink }
