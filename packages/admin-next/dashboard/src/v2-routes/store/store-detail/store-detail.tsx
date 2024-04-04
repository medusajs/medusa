import { Outlet, useLoaderData } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useV2Store } from "../../../lib/api-v2"
import { StoreCurrencySection } from "./components/store-currency-section/store-currencies-section.tsx"
import { StoreGeneralSection } from "./components/store-general-section"
import { storeLoader } from "./loader"

export const StoreDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof storeLoader>>

  const { store, isLoading, isError, error } = useV2Store({
    initialData: initialData,
  })

  if (isLoading || !store) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <StoreGeneralSection store={store} />
      <StoreCurrencySection store={store} />
      <JsonViewSection data={store} />
      <Outlet />
    </div>
  )
}
