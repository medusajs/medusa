import { Badge, Container, Copy, Heading, Text } from "@medusajs/ui"
import { useAdminStore } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router-dom"

import { EditStoreDetailsDrawer } from "../../components/edit-store-details-drawer"
import { storeLoader } from "./loader"

export const StoreDetails = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof storeLoader>>

  const { store, isLoading, isError, error } = useAdminStore({
    initialData: initialData,
  })

  const { t } = useTranslation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !store) {
    if (error) {
      throw error
    }

    return <div>{JSON.stringify(error, null, 2)}</div>
  }

  return (
    <div>
      <Container className="p-0">
        <div className="border-b px-8 py-6">
          <Heading>{t("store.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("store.manageYourStoresDetails")}
          </Text>
        </div>
        <div className="grid grid-cols-2 border-b px-8 py-6">
          <Text size="small" leading="compact" weight="plus">
            {t("store.storeName")}
          </Text>
          <Text size="small" leading="compact">
            {store.name}
          </Text>
        </div>
        <div className="grid grid-cols-2 border-b px-8 py-6">
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
        <div className="grid grid-cols-2 border-b px-8 py-6">
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
        <div className="grid grid-cols-2 border-b px-8 py-6">
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
        <div className="flex items-center justify-end px-8 py-6">
          <EditStoreDetailsDrawer store={store} />
        </div>
      </Container>
    </div>
  )
}
