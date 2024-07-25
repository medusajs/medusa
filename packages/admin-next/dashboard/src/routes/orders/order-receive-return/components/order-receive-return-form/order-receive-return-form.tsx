import { useTranslation } from "react-i18next"

import { AdminOrder, AdminReturn } from "@medusajs/types"
import { Alert, Button, Input, Switch, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrrowRight } from "@medusajs/icons"
import * as zod from "zod"

import { Thumbnail } from "../../../../../components/common/thumbnail"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useStockLocation } from "../../../../../hooks/api"
import { ReceiveReturnSchema } from "./constants"
import { Form } from "../../../../../components/common/form"
import { Divider } from "../../../../../components/common/divider"
import { useMemo } from "react"

type OrderAllocateItemsFormProps = {
  order: AdminOrder
  preview: AdminOrder
  orderReturn: AdminReturn
}

export function OrderReceiveReturnForm({
  order,
  preview,
  orderReturn,
}: OrderAllocateItemsFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { stock_location = { name: "Flagship" } } = useStockLocation(
    orderReturn.location_id,
    undefined,
    {
      enabled: !!orderReturn.location_id,
    }
  )

  const itemsMap = useMemo(() => {
    const ret = {}
    order.items.forEach((i) => (ret[i.id] = i))
    return ret
  }, [order.items])

  const form = useForm<zod.infer<typeof ReceiveReturnSchema>>({
    defaultValues: {
      send_notification: false,
    },
    resolver: zodResolver(ReceiveReturnSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      handleSuccess(`/orders/${order.id}`)

      toast.success(t("general.success"), {
        description: t("orders.returns.receive.toast.success"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden px-6 py-4"
      >
        <div className="flex justify-between">
          <div>
            {stock_location && (
              <div className="flex items-center gap-2">
                <ArrrowRight className="text-ui-fg-subtle" />{" "}
                <span className="text-ui-fg-base txt-small font-medium">
                  {stock_location.name}
                </span>
              </div>
            )}
          </div>
          <span className="text-ui-fg-muted txt-small text-right">
            {t("orders.returns.receive.itemsLabel")}
          </span>
        </div>
        {preview.items
          // .filter((i) => i.detail.return_received_quantity)
          .map((item) => {
            const originalItem = itemsMap[item.id]
            return (
              <div
                key={item.id}
                className="bg-ui-bg-subtle shadow-elevation-card-rest mt-2 rounded-xl"
              >
                <div className="flex flex-col items-center gap-x-2 gap-y-2 p-3 text-sm md:flex-row">
                  <div className="flex flex-1 items-center gap-x-3">
                    <Text size="small" className="text-ui-fg-subtle">
                      {item.quantity}x
                    </Text>

                    <Thumbnail src={item.thumbnail} />
                    <div className="flex flex-col">
                      <div>
                        <Text className="txt-small" as="span" weight="plus">
                          {item.title}{" "}
                        </Text>
                        {originalItem.variant.sku && (
                          <span>({originalItem.variant.sku})</span>
                        )}
                      </div>
                      <Text as="div" className="text-ui-fg-subtle txt-small">
                        {originalItem.variant.product.title}
                      </Text>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-row items-center gap-2">
                    <Form.Field
                      control={form.control}
                      name="quantity"
                      render={({ field: { onChange, value, ...field } }) => {
                        return (
                          <Form.Item className="w-full">
                            <Form.Control>
                              <Input
                                min={0}
                                max={item.quantity}
                                type="number"
                                value={item.detail.return_received_quantity}
                                className="bg-ui-bg-field-component text-right"
                                onChange={(e) => {
                                  const value = e.target.value

                                  if (value === "") {
                                    onChange(null)
                                  } else {
                                    onChange(parseFloat(value))
                                  }
                                }}
                                {...field}
                              />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}

        <Divider className="my-6" />

        <Alert className="mb-4 rounded-xl" variant="warning">
          {t("orders.returns.receive.inventoryWarning")}
        </Alert>

        <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl p-3">
          <Form.Field
            control={form.control}
            name="send_notification"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <div className="flex items-center gap-3">
                    <Form.Control>
                      <Switch
                        className="mt-1 self-start"
                        checked={!!value}
                        onCheckedChange={onChange}
                        {...field}
                      />
                    </Form.Control>
                    <div className="flex flex-col">
                      <Form.Label>
                        {t("orders.returns.sendNotification")}
                      </Form.Label>
                      <Form.Hint className="!mt-1">
                        {t("orders.returns.receive.sendNotificationHint")}
                      </Form.Hint>
                    </div>
                  </div>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </div>
      </form>
      <RouteDrawer.Footer className="overflow-hidden">
        <div className="flex items-center gap-x-2">
          <RouteDrawer.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </RouteDrawer.Close>
          <Button size="small" type="submit" isLoading={false}>
            {t("actions.save")}
          </Button>
        </div>
      </RouteDrawer.Footer>
    </RouteDrawer.Form>
  )
}
