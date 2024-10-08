import { useLoaderData } from "react-router-dom"

import { useStore } from "../../../hooks/api/store.tsx"
import { StoreCurrencySection } from "./components/store-currency-section/store-currencies-section.tsx/index.ts"
import { StoreGeneralSection } from "./components/store-general-section/index.ts"
import { storeLoader } from "./loader.ts"

import after from "virtual:medusa/widgets/store/details/after"
import before from "virtual:medusa/widgets/store/details/before"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton/skeleton.tsx"
import { SingleColumnPage } from "../../../components/layout/pages/index.ts"

export const StoreDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof storeLoader>>

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
    <SingleColumnPage
      widgets={{
        before,
        after,
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
