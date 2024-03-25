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
            {t("actions.edit")}
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
          <Badge size="2xsmall">
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
          <div className="bg-ui-bg-subtle border-ui-border-base box-border flex w-fit cursor-default items-center gap-x-0.5 overflow-hidden rounded-full border pl-2 pr-1">
            <Text size="xsmall" leading="compact" className="truncate">
              {store.swap_link_template}
            </Text>
            <Copy
              content={store.swap_link_template}
              variant="mini"
              className="text-ui-fg-subtle"
            />
          </div>
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
          <div className="bg-ui-bg-subtle border-ui-border-base box-border flex w-fit cursor-default items-center gap-x-0.5 overflow-hidden rounded-full border pl-2 pr-1">
            <Text size="xsmall" leading="compact" className="truncate">
              {store.payment_link_template}
            </Text>
            <Copy
              content={store.payment_link_template}
              variant="mini"
              className="text-ui-fg-subtle"
            />
          </div>
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
          <div className="bg-ui-bg-subtle border-ui-border-base box-border flex w-fit cursor-default items-center gap-x-0.5 overflow-hidden rounded-full border pl-2 pr-1">
            <Text size="xsmall" leading="compact" className="truncate">
              {store.invite_link_template}
            </Text>
            <Copy
              content={store.invite_link_template}
              variant="mini"
              className="text-ui-fg-subtle"
            />
          </div>
        ) : (
          <Text size="small" leading="compact">
            -
          </Text>
        )}
      </div>
    </Container>
  )
}
