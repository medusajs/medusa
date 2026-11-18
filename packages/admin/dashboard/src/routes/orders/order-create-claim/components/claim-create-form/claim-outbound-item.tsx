import { XCircle } from "@medusajs/icons"
import { AdminOrderLineItem, HttpTypes } from "@medusajs/types"
import { Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { Form } from "../../../../../components/common/form"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { CreateClaimSchemaType } from "./schema"

type ClaimOutboundItemProps = {
  previewItem: AdminOrderLineItem
  currencyCode: string
  index: number

  onRemove: () => void
  // TODO: create a payload type for outbound updates
  onUpdate: (payload: HttpTypes.AdminUpdateReturnItems) => void

  form: UseFormReturn<CreateClaimSchemaType>
}

function ClaimOutboundItem({
  previewItem,
  currencyCode,
  form,
  onRemove,
  onUpdate,
  index,
}: ClaimOutboundItemProps) {
  const { t } = useTranslation()

  return (
    <div className="my-2 rounded-xl bg-ui-bg-subtle shadow-elevation-card-rest">
      <div className="flex flex-col items-center gap-x-2 gap-y-2 border-b p-3 text-sm md:flex-row">
        <div className="flex flex-1 items-center gap-x-3">
          <Thumbnail src={previewItem.thumbnail} />

          <div className="flex flex-col">
            <div>
              <Text className="txt-small" as="span" weight="plus">
                {previewItem.title}{" "}
              </Text>

              {previewItem.variant_sku && (
                <span>({previewItem.variant_sku})</span>
              )}
            </div>
            <Text as="div" className="txt-small text-ui-fg-subtle">
              {previewItem.subtitle}
            </Text>
          </div>
        </div>

        <div className="flex flex-1 justify-between">
          <div className="flex flex-grow items-center gap-2">
            <Form.Field
              control={form.control}
              name={`outbound_items.${index}.quantity`}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        {...field}
                        className="txt-small w-[67px] rounded-lg bg-ui-bg-base"
                        min={1}
                        // TODO: add max available inventory quantity if present
                        // max={previewItem.quantity}
                        type="number"
                        onBlur={(e) => {
                          const val = e.target.value
                          const payload = val === "" ? null : Number(val)

                          field.onChange(payload)

                          if (payload) {
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

          <div className="txt-small mr-2 flex flex-shrink-0 text-ui-fg-subtle">
            <MoneyAmountCell
              currencyCode={currencyCode}
              amount={previewItem.total}
            />
          </div>

          <ActionMenu
            groups={[
              {
                actions: [
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
    </div>
  )
}

export { ClaimOutboundItem }
