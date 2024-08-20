import { CheckCircleSolid, SquareTwoStack } from "@medusajs/icons"
import { AdminOrder } from "@medusajs/types"
import { Button, toast, Tooltip } from "@medusajs/ui"
import copy from "copy-to-clipboard"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useCreatePaymentCollection,
  useDeletePaymentCollection,
} from "../../../../../hooks/api"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"

export const MEDUSA_BACKEND_URL = __STOREFRONT_URL__ ?? "http://localhost:8000"

type CopyPaymentLinkProps = {
  order: AdminOrder
}

/**
 * This component is based on the `button` element and supports all of its props
 */
const CopyPaymentLink = React.forwardRef<any, CopyPaymentLinkProps>(
  ({ order }: CopyPaymentLinkProps, ref) => {
    const [isCreating, setIsCreating] = useState(false)
    const [url, setUrl] = useState("")
    const [done, setDone] = useState(false)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("CopyPaymentLink")
    const { t } = useTranslation()
    const { mutateAsync: createPaymentCollection } =
      useCreatePaymentCollection()

    const { mutateAsync: deletePaymentCollection } =
      useDeletePaymentCollection()

    const copyToClipboard = async (
      e:
        | React.MouseEvent<HTMLElement, MouseEvent>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation()

      if (!url?.length) {
        const activePaymentCollection = order.payment_collections.find(
          (pc) =>
            pc.status === "not_paid" &&
            pc.amount === order.summary?.pending_difference
        )

        if (!activePaymentCollection) {
          setIsCreating(true)

          const paymentCollectionsToDelete = order.payment_collections.filter(
            (pc) => pc.status === "not_paid"
          )

          const promises = paymentCollectionsToDelete.map((paymentCollection) =>
            deletePaymentCollection(paymentCollection.id)
          )

          await Promise.all(promises)

          await createPaymentCollection(
            { order_id: order.id },
            {
              onSuccess: (data) => {
                setUrl(
                  `${MEDUSA_BACKEND_URL}/payment-collection/${data.payment_collection.id}`
                )
              },
              onError: (err) => {
                toast.error(err.message)
              },
              onSettled: () => setIsCreating(false),
            }
          )
        } else {
          setUrl(
            `${MEDUSA_BACKEND_URL}/payment-collection/${activePaymentCollection.id}`
          )
        }
      }

      setDone(true)
      copy(url)

      setTimeout(() => {
        setDone(false)
        setUrl("")
      }, 2000)
    }

    React.useEffect(() => {
      if (done) {
        setText("Copied")
        return
      }

      setTimeout(() => {
        setText("CopyPaymentLink")
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
          isLoading={isCreating}
        >
          {done ? (
            <CheckCircleSolid className="inline" />
          ) : (
            <SquareTwoStack className="inline" />
          )}
          {t("orders.payment.paymentLink", {
            amount: getStylizedAmount(
              order?.summary?.pending_difference,
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
