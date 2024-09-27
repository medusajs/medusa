import { useLoaderData } from "react-router-dom"

import { useStore } from "../../../hooks/api/store.tsx"
import { StoreCurrencySection } from "./components/store-currency-section/store-currencies-section.tsx/index.ts"
import { StoreGeneralSection } from "./components/store-general-section/index.ts"
import { storeLoader } from "./loader.ts"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton/skeleton.tsx"
import { SingleColumnPage } from "../../../components/layout/pages/index.ts"
import { useDashboardExtension } from "../../../extensions/index.ts"

export const StoreDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof storeLoader>>

  const { store, isPending, isError, error } = useStore(undefined, {
    initialData,
  })

  const { getWidgets } = useDashboardExtension()

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
    >
      <StoreGeneralSection store={store} />
      <StoreCurrencySection store={store} />
    </SingleColumnPage>
  )
}
