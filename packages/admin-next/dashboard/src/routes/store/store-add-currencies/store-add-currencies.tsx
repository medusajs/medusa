import { FocusModal } from "@medusajs/ui"
import { useAdminStore } from "medusa-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AddCurrenciesForm } from "./components/add-currencies-form/add-currencies-form"

export const StoreAddCurrencies = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const { store, isLoading, isError, error } = useAdminStore()

  useEffect(() => {
    setOpen(true)
  }, [])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        navigate(`/settings/store`, { replace: true })
      }, 200)
    }

    setOpen(open)
  }

  if (isError) {
    throw error
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        {isLoading || !store ? (
          <div>Loading...</div>
        ) : (
          <AddCurrenciesForm store={store} />
        )}
      </FocusModal.Content>
    </FocusModal>
  )
}
