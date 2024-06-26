import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Switch } from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { AdminOrder } from "@medusajs/types"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"

import { ReturnCreateSchema, ReturnCreateSchemaType } from "./schema"
import { LinkButton } from "../../../../../components/common/link-button"
import { AddReturnItemsTable } from "../add-return-items-table"
import { Form } from "../../../../../components/common/form"
import { ReturnItem } from "./return-item.tsx"

type ReturnCreateFormProps = {
  order: AdminOrder
}

let selectedItems: string[] = []

export const ReturnCreateForm = ({ order }: ReturnCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [showAddItemView, setShowAddItemView] = useState(false)

  const form = useForm<ReturnCreateSchemaType>({
    defaultValues: { items: [] },
    resolver: zodResolver(ReturnCreateSchema),
  })

  const itemsMap = useMemo(
    () => new Map(order.items.map((i) => [i.id, i])),
    [order.items]
  )

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    name: "items",
    control: form.control,
  })

  const { mutateAsync, isPending } = {} // useCreateReturn()

  const handleSubmit = form.handleSubmit(
    async (data) => {},
    (error) => console.error(error)
  )

  const onItemsSelected = () => {
    const selected = Object.fromEntries(selectedItems.map((i) => [i, true]))

    const toRemove = []
    const existingItems = {}
    items.forEach((item, ind) => {
      if (!(item.id in selected)) {
        toRemove.push(ind)
      }

      existingItems[item.id]
    })

    remove(toRemove)

    selectedItems.forEach((id) => {
      if (!(id in existingItems)) {
        append({ item_id: id, quantity: 1 })
      }
    })

    setShowAddItemView(false)
  }

  const showPlaceholder = !items.length

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <div className="flex w-full items-center justify-end gap-x-4">
            <div className="flex items-center justify-end gap-x-2">
              <RouteFocusModal.Close asChild>
                <Button variant="secondary" size="small">
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button
                key="submit-button"
                type="submit"
                variant="primary"
                size="small"
                isLoading={isPending}
              >
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex size-full justify-center overflow-y-auto">
          <div className="mt-16 w-[720px] max-w-[100%] px-4 md:p-0">
            <Heading level="h1">{t("orders.returns.create")}</Heading>

            <div className="mt-8 flex items-center justify-between">
              <Heading level="h2">{t("orders.returns.inbound")}</Heading>
              <LinkButton onClick={() => setShowAddItemView(true)}>
                {t("actions.addItems")}
              </LinkButton>
            </div>

            {showPlaceholder && (
              <div className="bg-ui-bg-field mt-4 block h-[56px] w-full rounded-lg border border-dashed" />
            )}

            {items.map((item) => (
              <ReturnItem
                key={item.id}
                item={itemsMap.get(item.item_id)!}
                currencyCode={order.currency_code}
                form={form}
              />
            ))}

            {/*TOTALS SECTION*/}
            <div className="mt-8 border-y border-dotted py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.returns.returnTotal")}
                </span>
                <span className="txt-small text-ui-fg-subtle">-</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.returns.inboundShipping")}
                </span>
                <span className="txt-small text-ui-fg-subtle">-</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-dotted pt-4">
                <span className="txt-small font-medium">
                  {t("orders.returns.refundAmount")}
                </span>
                <span className="txt-small font-medium">-</span>
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

        {showAddItemView && (
          <AddReturnItemsTable
            items={order.items!}
            selectedItems={items.map((i) => i.item_id)}
            currencyCode={order.currency_code}
            onSelectionChange={(s) => (selectedItems = s)}
            onSave={onItemsSelected}
            onCancel={() => setShowAddItemView(false)}
          />
        )}
      </form>
    </RouteFocusModal.Form>
  )
}
