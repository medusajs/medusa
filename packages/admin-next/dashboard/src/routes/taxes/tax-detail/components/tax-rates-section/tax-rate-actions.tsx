import type { TaxRate } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"

import { ExclamationCircle, PencilSquare, Trash } from "@medusajs/icons"
import { usePrompt } from "@medusajs/ui"
import { useAdminDeleteTaxRate } from "medusa-react"
import { ActionMenu } from "../../../../../components/common/action-menu"

export const TaxRateActions = ({ taxRate }: { taxRate: TaxRate }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteTaxRate(taxRate.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("taxes.taxRate.deleteRateDescription", {
        name: taxRate.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

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
