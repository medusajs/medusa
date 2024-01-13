import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const useFormPrompt = () => {
  const { t } = useTranslation()
  const fn = usePrompt()

  const promptValues = {
    title: t("general.unsavedChangesTitle"),
    description: t("general.unsavedChangesDescription"),
    cancelText: t("general.cancel"),
    confirmText: t("general.continue"),
  }

  const prompt = async () => {
    return await fn(promptValues)
  }

  return prompt
}
