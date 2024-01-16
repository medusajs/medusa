import { Drawer, Heading } from "@medusajs/ui"
import { useAdminStore } from "medusa-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { json, useNavigate } from "react-router-dom"
import { EditStoreForm } from "./components/edit-store-form/edit-store-form"

export const StoreEdit = () => {
  const [open, setOpen] = useState(false)
  const { store, isLoading, isError, error } = useAdminStore()

  const navigate = useNavigate()
  const { t } = useTranslation()

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

  if (!store && !isLoading) {
    throw json("An unknown error has occured", 500)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading className="capitalize">{t("store.editStore")}</Heading>
        </Drawer.Header>
        {store && (
          <EditStoreForm store={store} onSuccess={() => onOpenChange(false)} />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
