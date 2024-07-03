import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDeleteTaxRegion } from "../../../hooks/api/tax-regions"

export const useDeleteTaxRegionAction = ({
  taxRegion,
  to = "/settings/tax-regions",
}: {
  taxRegion: HttpTypes.AdminTaxRegion
  to?: string
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteTaxRegion(taxRegion.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("taxRegions.delete.confirmation"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("taxRegions.delete.successToast"),
          dismissable: true,
          dismissLabel: t("actions.close"),
        })

        navigate(to, { replace: true })
      },
      onError: (e) => {
        toast.error(t("general.error"), {
          description: e.message,
          dismissable: true,
          dismissLabel: t("actions.close"),
        })
      },
    })
  }

  return handleDelete
}

export const useDeleteTaxRateAction = (taxRate: HttpTypes.AdminTaxRate) => {}
