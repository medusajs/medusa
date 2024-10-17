import { zodResolver } from "@hookform/resolvers/zod"
import { AdminOrder, AdminOrderPreview } from "@medusajs/types"
import { Button, Heading, Input, Switch, toast, usePrompt } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"

import { Form } from "../../../../../components/common/form"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  useCancelOrderEdit,
  useRequestOrderEdit,
} from "../../../../../hooks/api/order-edits"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { OrderEditItemsSection } from "./order-edit-items-section"
import { CreateOrderEditSchemaType, OrderEditCreateSchema } from "./schema"

type ReturnCreateFormProps = {
  order: AdminOrder
  preview: AdminOrderPreview
}

export const OrderEditCreateForm = ({
  order,
  preview,
}: ReturnCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  /**
   * MUTATIONS
   */

  const { mutateAsync: cancelOrderEditRequest, isPending: isCanceling } =
    useCancelOrderEdit(order.id)

  const { mutateAsync: requestOrderEdit, isPending: isRequesting } =
    useRequestOrderEdit(order.id)

  const isRequestRunning = isCanceling || isRequesting

  /**
   * FORM
   */
  const form = useForm<CreateOrderEditSchemaType>({
    defaultValues: () => {
      return Promise.resolve({
        note: "", // TODO: add note when update edit route is added
        send_notification: false, // TODO: not supported in the API ATM
      })
    },
    resolver: zodResolver(OrderEditCreateSchema),
  })

  const prompt = usePrompt()

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await prompt({
        title: t("general.areYouSure"),
        description: t("orders.edits.confirmText"),
        confirmText: t("actions.continue"),
        cancelText: t("actions.cancel"),
        variant: "confirmation",
      })

      if (!res) {
        return
      }

      await requestOrderEdit()

      toast.success(t("orders.edits.createSuccessToast"))
      handleSuccess()
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
      })
    }
  })

  return (
    <RouteFocusModal.Form
      form={form}
      onClose={(isSubmitSuccessful) => {
        if (!isSubmitSuccessful) {
          cancelOrderEditRequest(undefined, {
            onSuccess: () => {
              toast.success(t("orders.edits.cancelSuccessToast"))
            },
            onError: (error) => {
              toast.error(error.message)
            },
          })
        }
      }}
    >
      <KeyboundForm onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header />

        <RouteFocusModal.Body className="flex size-full justify-center overflow-y-auto">
          <div className="mt-16 w-[720px] max-w-[100%] px-4 md:p-0">
            <Heading level="h1">{t("orders.edits.create")}</Heading>

            <OrderEditItemsSection preview={preview} order={order} />

            {/* TOTALS SECTION*/}
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
                  {getStylizedAmount(preview.total, order.currency_code)}
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

            {/* NOTE*/}
            <Form.Field
              control={form.control}
              name="note"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <div className="mt-8 flex">
                      <div className="block flex-1">
                        <Form.Label>{t("fields.note")}</Form.Label>
                        <Form.Hint className="!mt-1">
                          {t("orders.edits.noteHint")}
                        </Form.Hint>
                      </div>
                      <div className="w-full flex-1 flex-grow">
                        <Form.Control>
                          <Input {...field} placeholder={t("fields.note")} />
                        </Form.Control>
                      </div>
                    </div>
                  </Form.Item>
                )
              }}
            />

            {/* SEND NOTIFICATION*/}
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

            <div className="p-8" />
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex w-full items-center justify-end gap-x-4">
            <div className="flex items-center justify-end gap-x-2">
              <RouteFocusModal.Close asChild>
                <Button type="button" variant="secondary" size="small">
                  {t("orders.edits.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button
                key="submit-button"
                type="submit"
                variant="primary"
                size="small"
                isLoading={isRequestRunning}
              >
                {t("orders.edits.confirm")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
