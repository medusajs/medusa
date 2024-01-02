import { Container, Heading, Text } from "@medusajs/ui";
import { useAdminStore } from "medusa-react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";

import { EditStoreDetailsDrawer } from "../../components/edit-store-details-drawer";
import { storeLoader } from "./loader";

export const StoreDetails = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof storeLoader>
  >;

  const { store, isLoading, isError, error } = useAdminStore({
    initialData: initialData,
  });

  const { t } = useTranslation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !store) {
    return <div>{JSON.stringify(error, null, 2)}</div>;
  }

  return (
    <div>
      <Container className="p-0">
        <div className="py-6 px-8 border-b">
          <Heading>{t("store.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("store.manageYourStoresDetails")}
          </Text>
        </div>
        <div className="py-6 px-8 border-b grid grid-cols-2">
          <Text size="small" leading="compact" weight="plus">
            {t("store.storeName")}
          </Text>
          <Text size="small" leading="compact">
            {store.name}
          </Text>
        </div>
        <div className="py-6 px-8 border-b grid grid-cols-2">
          <Text size="small" leading="compact" weight="plus">
            {t("store.swapLinkTemplate")}
          </Text>
          <Text size="small" leading="compact">
            {store.swap_link_template || "-"}
          </Text>
        </div>
        <div className="py-6 px-8 border-b grid grid-cols-2">
          <Text size="small" leading="compact" weight="plus">
            {t("store.paymentLinkTemplate")}
          </Text>
          <Text size="small" leading="compact">
            {store.payment_link_template || "-"}
          </Text>
        </div>
        <div className="py-6 px-8 border-b grid grid-cols-2">
          <Text size="small" leading="compact" weight="plus">
            {t("store.inviteLinkTemplate")}
          </Text>
          <Text size="small" leading="compact">
            {store.invite_link_template || "-"}
          </Text>
        </div>
        <div className="py-6 px-8 flex items-center justify-end">
          <EditStoreDetailsDrawer store={store} />
        </div>
      </Container>
    </div>
  );
};
