import { zodResolver } from "@hookform/resolvers/zod"
import { AdminOrder, AdminOrderPreview } from "@medusajs/types"
import { Button, Heading, Switch, toast } from "@medusajs/ui"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"

import { Form } from "../../../../../components/common/form"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { CreateOrderEditSchemaType, OrderEditCreateSchema } from "./schema"

type ReturnCreateFormProps = {
  order: AdminOrder
  preview: AdminOrderPreview
}

let IS_CANCELING = false

export const OrderEditCreateForm = ({
  order,
  preview,
}: ReturnCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  /**
   * MUTATIONS
   */
  const { mutateAsync: confirmOrderEditRequest, isPending: isConfirming } = {} // useOrderEditConfirmRequest(exchange.id, order.id)

  const { mutateAsync: cancelOrderRequest, isPending: isCanceling } = {} // useCancelOrderEditRequest(exchange.id, order.id)

  const isRequestLoading = isConfirming || isCanceling

  /**
   * FORM
   */
  const form = useForm<CreateOrderEditSchemaType>({
    defaultValues: () => {
      return Promise.resolve({
        items: preview.items.map((i) => {
          // const inboundAction = i.actions?.find(
          //   (a) => a.action === "EDIT_ITEM_ADD"
          // )

          return {
            item_id: i.id,
            variant_id: i.variant_id,
            quantity: i.detail.return_requested_quantity,
          }
        }),

        send_notification: false,
      })
    },
    resolver: zodResolver(OrderEditCreateSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await confirmOrderEditRequest({
        no_notification: !data.send_notification,
      })

      handleSuccess()
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
      })
    }
  })

  useEffect(() => {
    /**
     * Unmount hook
     */
    return () => {
      if (IS_CANCELING) {
        cancelOrderRequest(undefined, {
          onSuccess: () => {
            toast.success(
              t("orders.exchanges.actions.cancelExchange.successToast")
            )
          },
          onError: (error) => {
            toast.error(error.message)
          },
        })

        IS_CANCELING = false
      }
    }
  }, [])

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header />

        <RouteFocusModal.Body className="flex size-full justify-center overflow-y-auto">
          <div className="mt-16 w-[720px] max-w-[100%] px-4 md:p-0">
            <Heading level="h1">{t("orders.exchanges.create")}</Heading>

            {/*<ExchangeInboundSection*/}
            {/*  form={form}*/}
            {/*  preview={preview}*/}
            {/*  order={order}*/}
            {/*  exchange={exchange}*/}
            {/*  orderReturn={orderReturn}*/}
            {/*/>*/}

            {/*TOTALS SECTION*/}
            <div className="mt-8 border-y border-dotted py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.edits.currentTotal")}
                </span>

                <span className="txt-small text-ui-fg-subtle">
                  {getStylizedAmount(order.total, order.currency_code)}
                </span>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.edits.newTotal")}
                </span>

                <span className="txt-small text-ui-fg-subtle">
                  {getStylizedAmount(preview.total, preview.currency_code)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-dotted pt-4">
                <span className="txt-small font-medium">
                  {t("orders.exchanges.refundAmount")}
                </span>
                <span className="txt-small font-medium">
                  {getStylizedAmount(
                    preview.summary.pending_difference,
                    order.currency_code
                  )}
                </span>
              </div>
            </div>
            {/*SEND NOTIFICATION*/}
            <div className="bg-ui-bg-field mt-8 rounded-lg border py-2 pl-2 pr-4">
              <Form.Field
                control={form.control}
                name="send_notification"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <Form.Item>
                      <div className="flex items-center">
                        <Form.Control className="mr-4 self-start">
                          <Switch
                            className="mt-[2px]"
                            checked={!!value}
                            onCheckedChange={onChange}
                            {...field}
                          />
                        </Form.Control>
                        <div className="block">
                          <Form.Label>
                            {t("orders.returns.sendNotification")}
                          </Form.Label>
                          <Form.Hint className="!mt-1">
                            {t("orders.returns.sendNotificationHint")}
                          </Form.Hint>
                        </div>
                      </div>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex w-full items-center justify-end gap-x-4">
            <div className="flex items-center justify-end gap-x-2">
              <RouteFocusModal.Close asChild>
                <Button
                  type="button"
                  onClick={() => (IS_CANCELING = true)}
                  variant="secondary"
                  size="small"
                >
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button
                key="submit-button"
                type="submit"
                variant="primary"
                size="small"
                isLoading={isRequestLoading}
              >
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Footer>
      </form>
    </RouteFocusModal.Form>
  )
}
