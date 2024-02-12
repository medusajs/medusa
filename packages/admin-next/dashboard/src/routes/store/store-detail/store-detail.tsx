import { useAdminStore } from "medusa-react"
import { Outlet, useLoaderData } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section/json-view-section.tsx"
import { StoreCurrencySection } from "./components/store-currency-section/store-currencies-section.tsx/index.ts"
import { StoreGeneralSection } from "./components/store-general-section/index.ts"
import { storeLoader } from "./loader.ts"

export const StoreDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof storeLoader>>

  const { store, isLoading, isError, error } = useAdminStore({
    initialData: initialData,
  })

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
    <div className="flex flex-col gap-y-2">
      <StoreGeneralSection store={store} />
      <StoreCurrencySection store={store} />
      <JsonViewSection data={store} />
      <Outlet />
    </div>
  )
}
