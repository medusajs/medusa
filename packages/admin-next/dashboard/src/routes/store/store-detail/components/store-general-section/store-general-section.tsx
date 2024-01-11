import { Store } from "@medusajs/medusa"
import { Badge, Button, Container, Copy, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type StoreGeneralSectionProps = {
  store: Store
}

export const StoreGeneralSection = ({ store }: StoreGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("store.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("store.manageYourStoresDetails")}
          </Text>
        </div>
        <Link to={"/settings/store/edit"}>
          <Button size="small" variant="secondary">
            {t("general.edit")}
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {store.name}
        </Text>
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("store.defaultCurrency")}
        </Text>
        <div className="flex items-center gap-x-2">
          <Badge rounded="full">
            {store.default_currency_code.toUpperCase()}
          </Badge>
          <Text size="small" leading="compact">
            {store.default_currency.name}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("store.swapLinkTemplate")}
        </Text>
        {store.swap_link_template ? (
          <Copy content={store.swap_link_template} asChild>
            <Badge className="w-fit cursor-pointer" rounded="full">
              <span>{store.swap_link_template}</span>
            </Badge>
          </Copy>
        ) : (
          <Text size="small" leading="compact">
            -
          </Text>
        )}
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("store.paymentLinkTemplate")}
        </Text>
        {store.payment_link_template ? (
          <Copy content={store.payment_link_template} asChild>
            <Badge className="w-fit cursor-pointer" rounded="full">
              <span>{store.payment_link_template}</span>
            </Badge>
          </Copy>
        ) : (
          <Text size="small" leading="compact">
            -
          </Text>
        )}
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("store.inviteLinkTemplate")}
        </Text>
        {store.invite_link_template ? (
          <Copy content={store.invite_link_template} asChild>
            <Badge className="w-fit cursor-pointer" rounded="full">
              <span>{store.invite_link_template}</span>
            </Badge>
          </Copy>
        ) : (
          <Text size="small" leading="compact">
            -
          </Text>
        )}
      </div>
    </Container>
  )
}
