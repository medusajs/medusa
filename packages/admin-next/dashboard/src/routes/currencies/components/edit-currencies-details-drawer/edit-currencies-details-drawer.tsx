import { Button, Drawer, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const EditCurrenciesDetailsDrawer = () => {
  const { t } = useTranslation()

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="secondary">
          {t("currencies.editCurrencyDetails")}
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("currencies.editCurrencyDetails")}</Heading>
        </Drawer.Header>
        <Drawer.Body></Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">{t("general.cancel")}</Button>
          </Drawer.Close>
          <Button>{t("general.save")}</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
