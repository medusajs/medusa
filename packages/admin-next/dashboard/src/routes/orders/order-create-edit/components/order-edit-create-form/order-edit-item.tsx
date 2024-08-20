import { XCircle } from "@medusajs/icons"
import { AdminOrderLineItem, HttpTypes } from "@medusajs/types"
import { Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"

type ExchangeInboundItemProps = {
  item: AdminOrderLineItem
  currencyCode: string

  onRemove: () => void
  onUpdate: (payload: any) => void
}

function OrderEditItem({
  item,
  currencyCode,
  onRemove,
  onUpdate,
}: ExchangeInboundItemProps) {
  const { t } = useTranslation()

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

              {item.variant?.sku && <span>({item.variant.sku})</span>}
            </div>
            <Text as="div" className="text-ui-fg-subtle txt-small">
              {item.variant?.product?.title}
            </Text>
          </div>
        </div>

        <div className="flex flex-1 justify-between">
          <div className="flex flex-grow items-center gap-2">
            <Input
              className="bg-ui-bg-base txt-small w-[67px] rounded-lg"
              type="number"
              min={item.detail.fulfilled_quantity}
              defaultValue={item.quantity}
              onBlur={(e) => {
                const val = e.target.value
                const payload = val === "" ? null : Number(val)

                if (payload) {
                  onUpdate({ quantity: payload })
                }
              }}
            />
            <Text className="txt-small text-ui-fg-subtle">
              {t("fields.qty")}
            </Text>
          </div>

          <div className="text-ui-fg-subtle txt-small mr-2 flex flex-shrink-0">
            <MoneyAmountCell
              currencyCode={currencyCode}
              amount={item.return_requested_total}
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

export { OrderEditItem }
