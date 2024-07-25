import { useTranslation } from "react-i18next"

import React from "react"
import { IconButton, Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { HttpTypes, AdminOrderLineItem } from "@medusajs/types"
import { ChatBubble, DocumentText, XCircle, XMark } from "@medusajs/icons"

import { Thumbnail } from "../../../../../components/common/thumbnail"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { Form } from "../../../../../components/common/form"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Combobox } from "../../../../../components/inputs/combobox"
import { useReturnReasons } from "../../../../../hooks/api/return-reasons"

type OrderEditItemProps = {
  item: AdminOrderLineItem
  previewItem: AdminOrderLineItem
  currencyCode: string
  index: number

  onRemove: () => void
  onUpdate: (payload: HttpTypes.AdminUpdateReturnItems) => void

  form: UseFormReturn<any>
}

function ReturnItem({
  item,
  previewItem,
  currencyCode,
  form,
  onRemove,
  onUpdate,
  index,
}: OrderEditItemProps) {
  const { t } = useTranslation()

  const { return_reasons = [] } = useReturnReasons({ fields: "+label" })

  const formItem = form.watch(`items.${index}`)

  const showReturnReason = typeof formItem.reason_id === "string"
  const showNote = typeof formItem.note === "string"

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl ">
      <div className="flex flex-col items-center gap-x-2 gap-y-2 border-b p-3 text-sm md:flex-row">
        <div className="flex flex-1 items-center gap-x-3">
          <Thumbnail src={item.thumbnail} />
          <div className="flex flex-col">
            <div>
              <Text className="txt-small" as="span" weight="plus">
                {item.title}{" "}
              </Text>
              {item.variant.sku && <span>({item.variant.sku})</span>}
            </div>
            <Text as="div" className="text-ui-fg-subtle txt-small">
              {item.variant.product.title}
            </Text>
          </div>
        </div>

        <div className="flex flex-1 justify-between">
          <div className="flex flex-grow items-center gap-2">
            <Form.Field
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        className="bg-ui-bg-base txt-small w-[67px] rounded-lg"
                        min={1}
                        max={item.quantity}
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value
                          const payload = val === "" ? null : Number(val)

                          field.onChange(payload)

                          if (payload) {
                            // todo: move on blur
                            onUpdate({ quantity: payload })
                          }
                        }}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Text className="txt-small text-ui-fg-subtle">
              {t("fields.qty")}
            </Text>
          </div>

          <div className="text-ui-fg-subtle txt-small mr-2 flex flex-shrink-0">
            <MoneyAmountCell
              currencyCode={currencyCode}
              amount={previewItem.return_requested_total}
            />
          </div>

          <ActionMenu
            groups={[
              {
                actions: [
                  !showReturnReason && {
                    label: t("actions.addReason"),
                    onClick: () =>
                      form.setValue(`items.${index}.reason_id`, ""),
                    icon: <ChatBubble />,
                  },
                  !showNote && {
                    label: t("actions.addNote"),
                    onClick: () => form.setValue(`items.${index}.note`, ""),
                    icon: <DocumentText />,
                  },
                  {
                    label: t("actions.remove"),
                    onClick: onRemove,
                    icon: <XCircle />,
                  },
                ].filter(Boolean),
              },
            ]}
          />
        </div>
      </div>
      <>
        {/*REASON*/}
        {showReturnReason && (
          <div className="grid grid-cols-1 gap-2 p-3 md:grid-cols-2">
            <div>
              <Form.Label>{t("orders.returns.reason")}</Form.Label>
              <Form.Hint className="!mt-1">
                {t("orders.returns.reasonHint")}
              </Form.Hint>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex-grow">
                <Form.Field
                  control={form.control}
                  name={`items.${index}.reason_id`}
                  render={({ field: { ref, value, onChange, ...field } }) => {
                    return (
                      <Form.Item>
                        <Form.Control>
                          <Combobox
                            className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                            value={value}
                            onChange={(v) => {
                              onUpdate({ reason_id: v })
                              onChange(v)
                            }}
                            {...field}
                            options={return_reasons.map((reason) => ({
                              label: reason.label,
                              value: reason.id,
                            }))}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <IconButton
                type="button"
                className="flex-shrink"
                variant="transparent"
                onClick={() => {
                  onUpdate({ reason_id: null }) // TODO BE: we should be able to set to unset reason here
                  form.setValue(`items.${index}.reason_id`, "")
                }}
              >
                <XMark className="text-ui-fg-muted" />
              </IconButton>
            </div>
          </div>
        )}

        {/*NOTE*/}
        {showNote && (
          <div className="grid grid-cols-1 gap-2 p-3 md:grid-cols-2">
            <div>
              <Form.Label>{t("orders.returns.note")}</Form.Label>
              <Form.Hint className="!mt-1">
                {t("orders.returns.noteHint")}
              </Form.Hint>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex-grow">
                <Form.Field
                  control={form.control}
                  name={`items.${index}.note`}
                  render={({ field: { ref, onChange, ...field } }) => {
                    return (
                      <Form.Item>
                        <Form.Control>
                          <Input
                            onChange={onChange}
                            {...field}
                            onBlur={() =>
                              onUpdate({ internal_note: field.value })
                            }
                            className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <IconButton
                type="button"
                className="flex-shrink"
                variant="transparent"
                onClick={() => {
                  form.setValue(`items.${index}.note`, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                  onUpdate({ internal_note: null })
                }}
              >
                <XMark className="text-ui-fg-muted" />
              </IconButton>
            </div>
          </div>
        )}
      </>
    </div>
  )
}

export { ReturnItem }
