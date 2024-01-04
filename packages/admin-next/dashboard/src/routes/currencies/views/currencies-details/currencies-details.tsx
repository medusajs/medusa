import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { EditCurrenciesDetailsDrawer } from "../../components/edit-currencies-details-drawer"

export const CurrenciesDetails = () => {
  const { t } = useTranslation()

  return (
    <div>
      <Container className="p-0">
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <Heading>{t("currencies.domain")}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {t("currencies.manageTheCurrencies")}
            </Text>
          </div>
          <EditCurrenciesDetailsDrawer />
        </div>
      </Container>
    </div>
  )
}
