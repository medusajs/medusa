import { zodResolver } from "@hookform/resolvers/zod"
import { PencilSquare } from "@medusajs/icons"
import { AdminExchange, AdminOrder, AdminOrderPreview } from "@medusajs/types"
import {
  Button,
  CurrencyInput,
  Heading,
  IconButton,
  Switch,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"

import { Form } from "../../../../../components/common/form"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { CreateExchangeSchemaType, ExchangeCreateSchema } from "./schema"

import { AdminReturn } from "@medusajs/types"
import {
  useCancelExchangeRequest,
  useExchangeConfirmRequest,
  useUpdateExchangeInboundShipping,
} from "../../../../../hooks/api/exchanges"
import { currencies } from "../../../../../lib/data/currencies"
import { ExchangeInboundSection } from "./exchange-inbound-section.tsx"
import { ExchangeOutboundSection } from "./exchange-outbound-section"

type ReturnCreateFormProps = {
  order: AdminOrder
  exchange: AdminExchange
  preview: AdminOrderPreview
  orderReturn?: AdminReturn
}

let IS_CANCELING = false

export const ExchangeCreateForm = ({
  order,
  preview,
  exchange,
  orderReturn,
}: ReturnCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  /**
   * STATE
   */
  const [isShippingPriceEdit, setIsShippingPriceEdit] = useState(false)
  const [customShippingAmount, setCustomShippingAmount] = useState<
    number | string
  >(0)

  /**
   * MUTATIONS
   */
  const { mutateAsync: confirmExchangeRequest, isPending: isConfirming } =
    useExchangeConfirmRequest(exchange.id, order.id)

  const { mutateAsync: cancelExchangeRequest, isPending: isCanceling } =
    useCancelExchangeRequest(exchange.id, order.id)

  const {
    mutateAsync: updateInboundShipping,
    isPending: isUpdatingInboundShipping,
  } = useUpdateExchangeInboundShipping(exchange.id, order.id)

  const isRequestLoading =
    isConfirming || isCanceling || isUpdatingInboundShipping

  /**
   * Only consider items that belong to this exchange.
   */
  const previewItems = useMemo(
    () =>
      preview?.items?.filter(
        (i) => !!i.actions?.find((a) => a.exchange_id === exchange.id)
      ),
    [preview.items]
  )

  const inboundPreviewItems = previewItems.filter(
    (item) => !!item.actions?.find((a) => a.action === "RETURN_ITEM")
  )

  const outboundPreviewItems = previewItems.filter(
    (item) => !!item.actions?.find((a) => a.action === "ITEM_ADD")
  )

  /**
   * FORM
   */
  const form = useForm<CreateExchangeSchemaType>({
    defaultValues: () => {
      const inboundShippingMethod = preview.shipping_methods.find((s) => {
        const action = s.actions?.find((a) => a.action === "SHIPPING_ADD")

        return !!action?.return_id
      })

      const outboundShippingMethod = preview.shipping_methods.find((s) => {
        const action = s.actions?.find((a) => a.action === "SHIPPING_ADD")

        return !action?.return_id
      })

      return Promise.resolve({
        inbound_items: inboundPreviewItems.map((i) => {
          const inboundAction = i.actions?.find(
            (a) => a.action === "RETURN_ITEM"
          )

          return {
            item_id: i.id,
            variant_id: i.variant_id,
            quantity: i.detail.return_requested_quantity,
            note: inboundAction?.internal_note,
            reason_id: inboundAction?.details?.reason_id as string | undefined,
          }
        }),
        outbound_items: outboundPreviewItems.map((i) => ({
          item_id: i.id,
          variant_id: i.variant_id,
          quantity: i.detail.quantity,
        })),
        inbound_option_id: inboundShippingMethod
          ? inboundShippingMethod.shipping_option_id
          : "",
        outbound_option_id: outboundShippingMethod
          ? outboundShippingMethod.shipping_option_id
          : "",
        location_id: orderReturn?.location_id,
        send_notification: false,
      })
    },
    resolver: zodResolver(ExchangeCreateSchema),
  })

  const outboundShipping = preview.shipping_methods.find((s) => {
    const action = s.actions?.find((a) => a.action === "SHIPPING_ADD")

    return !action?.return_id
  })

  const shippingOptionId = form.watch("inbound_option_id")
  const prompt = usePrompt()

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await prompt({
        title: t("general.areYouSure"),
        description: t("orders.exchanges.confirmText"),
        confirmText: t("actions.continue"),
        cancelText: t("actions.cancel"),
        variant: "confirmation",
      })

      if (!res) {
        return
      }

      await confirmExchangeRequest({ no_notification: !data.send_notification })

      handleSuccess()
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
      })
    }
  })

  useEffect(() => {
    if (isShippingPriceEdit) {
      document.getElementById("js-shipping-input")?.focus()
    }
  }, [isShippingPriceEdit])

  useEffect(() => {
    /**
     * Unmount hook
     */
    return () => {
      if (IS_CANCELING) {
        cancelExchangeRequest(undefined, {
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

  const shippingTotal = useMemo(() => {
    const method = preview.shipping_methods.find(
      (sm) => !!sm.actions?.find((a) => a.action === "SHIPPING_ADD")
    )

    return (method?.total as number) || 0
  }, [preview.shipping_methods])

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header />

        <RouteFocusModal.Body className="flex size-full justify-center overflow-y-auto">
          <div className="mt-16 w-[720px] max-w-[100%] px-4 md:p-0">
            <Heading level="h1">{t("orders.exchanges.create")}</Heading>

            <ExchangeInboundSection
              form={form}
              preview={preview}
              order={order}
              exchange={exchange}
              orderReturn={orderReturn}
            />

            <ExchangeOutboundSection
              form={form}
              preview={preview}
              order={order}
              exchange={exchange}
            />

            {/*TOTALS SECTION*/}
            <div className="mt-8 border-y border-dotted py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.returns.inboundTotal")}
                </span>

                <span className="txt-small text-ui-fg-subtle">
                  {getStylizedAmount(
                    inboundPreviewItems.reduce((acc, item) => {
                      const action = item.actions?.find(
                        (act) => act.action === "RETURN_ITEM"
                      )
                      acc = acc + (action?.amount || 0)

                      return acc
                    }, 0) * -1,
                    order.currency_code
                  )}
                </span>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.exchanges.outboundTotal")}
                </span>

                <span className="txt-small text-ui-fg-subtle">
                  {getStylizedAmount(
                    outboundPreviewItems.reduce((acc, item) => {
                      const action = item.actions?.find(
                        (act) => act.action === "ITEM_ADD"
                      )
                      acc = acc + (action?.amount || 0)

                      return acc
                    }, 0),
                    order.currency_code
                  )}
                </span>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.returns.inboundShipping")}
                </span>

                <span className="txt-small text-ui-fg-subtle flex items-center">
                  {!isShippingPriceEdit && (
                    <IconButton
                      onClick={() => setIsShippingPriceEdit(true)}
                      variant="transparent"
                      className="text-ui-fg-muted"
                      disabled={
                        !inboundPreviewItems?.length || !shippingOptionId
                      }
                    >
                      <PencilSquare />
                    </IconButton>
                  )}

                  {isShippingPriceEdit ? (
                    <CurrencyInput
                      id="js-shipping-input"
                      onBlur={() => {
                        let actionId

                        preview.shipping_methods.forEach((s) => {
                          if (s.actions) {
                            for (const a of s.actions) {
                              if (a.action === "SHIPPING_ADD" && !a.return_id) {
                                actionId = a.id
                              }
                            }
                          }
                        })

                        const customPrice =
                          customShippingAmount === ""
                            ? null
                            : parseInt(customShippingAmount)

                        if (actionId) {
                          updateInboundShipping(
                            {
                              actionId,
                              custom_price: customPrice,
                            },
                            {
                              onError: (error) => {
                                toast.error(error.message)
                              },
                            }
                          )
                        }
                        setIsShippingPriceEdit(false)
                      }}
                      symbol={
                        currencies[order.currency_code.toUpperCase()]
                          .symbol_native
                      }
                      code={order.currency_code}
                      onValueChange={setCustomShippingAmount}
                      value={customShippingAmount}
                      disabled={!inboundPreviewItems?.length}
                    />
                  ) : (
                    getStylizedAmount(shippingTotal, order.currency_code)
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.exchanges.outboundShipping")}
                </span>

                <span className="txt-small text-ui-fg-subtle flex items-center">
                  {getStylizedAmount(
                    outboundShipping?.amount ?? 0,
                    order.currency_code
                  )}
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

            <div className="p-8" />
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
                  {t("orders.exchanges.cancel")}
                </Button>
              </RouteFocusModal.Close>

              <Button
                key="submit-button"
                type="submit"
                variant="primary"
                size="small"
                isLoading={isRequestLoading}
              >
                {t("orders.exchanges.confirm")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Footer>
      </form>
    </RouteFocusModal.Form>
  )
}
