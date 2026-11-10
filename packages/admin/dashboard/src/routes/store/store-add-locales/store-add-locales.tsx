import { RouteFocusModal } from "../../../components/modals/route-focus-modal"
import { useStore } from "../../../hooks/api"
import { AddLocalesForm } from "./components/add-locales-form/add-locales-form"

export const StoreAddLocales = () => {
  const { store, isPending, isError, error } = useStore()

  const ready = !!store && !isPending

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && <AddLocalesForm store={store} />}
    </RouteFocusModal>
  )
}
