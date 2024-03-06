import type { TaxRate } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"

import { ExclamationCircle, PencilSquare } from "@medusajs/icons"
import { ActionMenu } from "../../../../../components/common/action-menu"

export const TaxRateActions = ({ taxRate }: { taxRate: TaxRate }) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("taxes.taxRate.editRateAction"),
              to: `tax-rates/${taxRate.id}/edit`,
              icon: <PencilSquare />,
            },
            {
              label: t("taxes.taxRate.editOverridesAction"),
              to: `tax-rates/${taxRate.id}/edit-overrides`,
              icon: <ExclamationCircle />,
            },
          ],
        },
      ]}
    />
  )
}
