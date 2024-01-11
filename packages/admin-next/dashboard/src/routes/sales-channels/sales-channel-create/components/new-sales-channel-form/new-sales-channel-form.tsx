import { Button, FocusModal } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const NewSalesChannelForm = () => {
  const { t } = useTranslation()

  return (
    <form>
      <FocusModal.Header>
        <div className="flex items-center justify-end gap-x-2">
          <FocusModal.Close asChild>
            <Button size="small" variant="secondary">
              {t("general.cancel")}
            </Button>
          </FocusModal.Close>
          <Button size="small">{t("general.save")}</Button>
        </div>
      </FocusModal.Header>
      <FocusModal.Content></FocusModal.Content>
    </form>
  )
}
