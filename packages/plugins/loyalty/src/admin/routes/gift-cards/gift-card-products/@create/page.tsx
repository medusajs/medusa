import { RouteFocusModal } from "../../../../components/modals";
import { usePricePreferences } from "../../../../hooks/api/price-preferences";
import { useRegions } from "../../../../hooks/api/regions";
import { useSalesChannel } from "../../../../hooks/api/sales-channels";
import { useStore } from "../../../../hooks/api/store";
import { GiftCardProductCreateForm } from "../components/gift-card-product-create-form";

const GiftCardProductCreate = () => {
  const {
    store,
    isPending: isStorePending,
    isError: isStoreError,
    error: storeError,
  } = useStore({
    fields: "+default_sales_channel",
  });

  const {
    sales_channel,
    isPending: isSalesChannelPending,
    isError: isSalesChannelError,
    error: salesChannelError,
  } = useSalesChannel(store?.default_sales_channel_id!, {
    enabled: !!store?.default_sales_channel_id,
  });

  const {
    regions,
    isPending: isRegionsPending,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({ limit: 9999 });

  const {
    price_preferences,
    isPending: isPricePreferencesPending,
    isError: isPricePreferencesError,
    error: pricePreferencesError,
  } = usePricePreferences({
    limit: 9999,
  });

  const ready =
    !!store &&
    !isStorePending &&
    !!regions &&
    !isRegionsPending &&
    !!sales_channel &&
    !isSalesChannelPending &&
    !!price_preferences &&
    !isPricePreferencesPending;

  if (isStoreError) {
    throw storeError;
  }

  if (isRegionsError) {
    throw regionsError;
  }

  if (isSalesChannelError) {
    throw salesChannelError;
  }

  if (isPricePreferencesError) {
    throw pricePreferencesError;
  }

  return (
    <RouteFocusModal>
      <RouteFocusModal.Title asChild>
        <span className="sr-only">Create Gift Card Product</span>
      </RouteFocusModal.Title>

      <RouteFocusModal.Description asChild>
        <span className="sr-only">Create a new gift card product</span>
      </RouteFocusModal.Description>

      {ready && (
        <GiftCardProductCreateForm
          defaultChannel={sales_channel}
          store={store}
          pricePreferences={price_preferences}
          regions={regions}
        />
      )}
    </RouteFocusModal>
  );
};

export default GiftCardProductCreate;
