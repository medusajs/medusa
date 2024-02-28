import {
  useAdminRegion,
  useAdminRegionFulfillmentOptions,
  useAdminShippingProfiles,
  useAdminStore,
} from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { CreateShippingOptionForm } from "./components/create-shipping-option-form"

export const RegionCreateShippingOption = () => {
  const { id } = useParams()

  const {
    region,
    isLoading: isLoadingRegion,
    isError: isRegionError,
    error: regionError,
  } = useAdminRegion(id!)

  const {
    store,
    isLoading: isLoadingStore,
    isError: isStoreError,
    error: storeError,
  } = useAdminStore()

  const {
    shipping_profiles,
    isLoading: isLoadingProfiles,
    isError: isProfilesError,
    error: profileError,
  } = useAdminShippingProfiles()

  const {
    fulfillment_options,
    isLoading: isLoadingOptions,
    isError: isOptionsError,
    error: optionsError,
  } = useAdminRegionFulfillmentOptions(id!)

  const isLoading =
    isLoadingProfiles || isLoadingOptions || isLoadingRegion || isLoadingStore

  if (isStoreError) {
    throw storeError
  }

  if (isRegionError) {
    throw regionError
  }

  if (isProfilesError) {
    throw profileError
  }

  if (isOptionsError) {
    throw optionsError
  }

  return (
    <RouteFocusModal>
      {!isLoading &&
        region &&
        store &&
        shipping_profiles &&
        fulfillment_options && (
          <CreateShippingOptionForm
            region={region}
            store={store}
            fulfillmentOptions={fulfillment_options}
            shippingProfiles={shipping_profiles}
          />
        )}
    </RouteFocusModal>
  )
}
