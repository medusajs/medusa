import { RouteFocusModal } from "../../../components/modals/route-focus-modal"
import { useStore } from "../../../hooks/api"
import { AddLocalesForm } from "./components/add-locales-form/add-locales-form"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { useNavigate } from "react-router-dom"

export const StoreAddLocales = () => {
  const isEnabled = useFeatureFlag("translation")
  const navigate = useNavigate()

  const { store, isPending, isError, error } = useStore()

  if (!isEnabled) {
    navigate(-1)
    return null
  }

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
