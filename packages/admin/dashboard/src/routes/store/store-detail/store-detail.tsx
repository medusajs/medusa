import { useLoaderData } from "react-router-dom"

import { useStore } from "../../../hooks/api/store"
import { StoreGeneralSection } from "./components/store-general-section"
import { storeLoader } from "./loader"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { StoreCurrencySection } from "./components/store-currency-section"
import { StoreLocaleSection } from "./components/store-locale-section"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { PermissionGuard } from "../../../components/common/permission-guard"

export const StoreDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof storeLoader>>
  const isTranslationsEnabled = useFeatureFlag("translation")

  const { store, isPending, isError, error } = useStore(undefined, {
    initialData,
  })

  const { getWidgets } = useExtension()

  if (isPending || !store) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("store.details.before"),
        after: getWidgets("store.details.after"),
      }}
      data={store}
      hasOutlet
      showMetadata
      showJSON
      showRequiredPermissions
    >
      <StoreGeneralSection store={store} />
      <PermissionGuard permission="currency:read">
        <StoreCurrencySection store={store} />
      </PermissionGuard>
      {isTranslationsEnabled && <StoreLocaleSection store={store} />}
    </SingleColumnPage>
  )
}
