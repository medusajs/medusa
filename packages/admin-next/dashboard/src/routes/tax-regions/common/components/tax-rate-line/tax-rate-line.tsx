import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { formatPercentage } from "../../../../../lib/percentage-helpers"
import { useDeleteTaxRateAction } from "../../hooks"

type TaxRateLineProps = {
  taxRate: HttpTypes.AdminTaxRate
}

export const TaxRateLine = ({ taxRate }: TaxRateLineProps) => {
  return (
    <div className="text-ui-fg-subtle grid grid-cols-[1fr_1fr_28px] items-center gap-4 px-6 py-4">
      <div className="flex items-center gap-x-1.5">
        <Text size="small" weight="plus" leading="compact">
          {taxRate.name}
        </Text>
        {taxRate.code && (
          <div className="flex items-center gap-x-1.5">
            <Text size="small" leading="compact">
              ·
            </Text>
            <Text size="small" leading="compact">
              {taxRate.code}
            </Text>
          </div>
        )}
      </div>
      <Text size="small" leading="compact">
        {formatPercentage(taxRate.rate)}
      </Text>
      <TaxRateActions taxRate={taxRate} />
    </div>
  )
}

const TaxRateActions = ({ taxRate }: { taxRate: HttpTypes.AdminTaxRate }) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteTaxRateAction(taxRate)

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `tax-rates/${taxRate.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}
