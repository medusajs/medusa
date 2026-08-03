import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData } from "react-router-dom"

import { useStore } from "../../../hooks/api/store"
import { StoreGeneralSection } from "./components/store-general-section"
import { storeLoader } from "./loader"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { StoreCurrencySection } from "./components/store-currency-section"
import { StoreLocaleSection } from "./components/store-locale-section"

export const StoreDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof storeLoader>>
  const isTranslationsEnabled = useFeatureFlag("translation")

  const { store, isPending, isError, error } = useStore(undefined, {
    initialData,
  })

  if (isPending || !store) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="store.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={store}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="StoreGeneralSection">
              <StoreGeneralSection store={store} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="StoreCurrencySection">
              <StoreCurrencySection store={store} />
            </LayoutComposer.Entry>
            {isTranslationsEnabled && (
              <LayoutComposer.Entry id="StoreLocaleSection">
                <StoreLocaleSection store={store} />
              </LayoutComposer.Entry>
            )}
            {detailPageDefaultEntries(store, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
