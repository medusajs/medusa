import { Drawer, Heading } from "@medusajs/ui"
import { useAdminRegion } from "medusa-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { json, useNavigate, useParams } from "react-router-dom"

import { EditRegionForm } from "./components/edit-region-form"

export const RegionEdit = () => {
  const [open, setOpen] = useState(false)
  const { id } = useParams()
  const { region, isLoading, isError, error } = useAdminRegion(id!)
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(true)
  }, [])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        navigate(`/settings/regions/${id}`, { replace: true })
      }, 200)
    }

    setOpen(open)
  }

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  if (!region && !isLoading) {
    throw json("An unknown error has occured", 500)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("regions.editRegion")}</Heading>
        </Drawer.Header>
        {region && <EditRegionForm region={region} />}
      </Drawer.Content>
    </Drawer>
  )
}
