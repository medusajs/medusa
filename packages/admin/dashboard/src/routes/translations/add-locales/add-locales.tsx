import { RouteFocusModal } from "../../../components/modals/route-focus-modal"
import { useStore } from "../../../hooks/api"
import { AddLocalesForm } from "../../store/store-add-locales/components/add-locales-form/add-locales-form"

export const TranslationsAddLocales = () => {
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
