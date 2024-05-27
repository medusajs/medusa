import { Outlet, useLoaderData } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section/index.ts"
import { useStore } from "../../../hooks/api/store.tsx"
import { StoreCurrencySection } from "./components/store-currency-section/store-currencies-section.tsx/index.ts"
import { StoreGeneralSection } from "./components/store-general-section/index.ts"
import { storeLoader } from "./loader.ts"

import after from "virtual:medusa/widgets/store/details/after"
import before from "virtual:medusa/widgets/store/details/before"

export const StoreDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof storeLoader>>

  const {
    store,
    isPending: isLoading,
    isError,
    error,
  } = useStore({
    initialData,
  })

  if (isLoading || !store) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => (
        <div key={i}>
          <w.Component data={store} />
        </div>
      ))}
      <StoreGeneralSection store={store} />
      <StoreCurrencySection store={store} />
      {after.widgets.map((w, i) => (
        <div key={i}>
          <w.Component data={store} />
        </div>
      ))}
      <JsonViewSection data={store} />
      <Outlet />
    </div>
  )
}
