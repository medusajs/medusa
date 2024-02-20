import { Drawer, Heading } from "@medusajs/ui"
import { useAdminV2GetSession } from "medusa-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { EditProfileForm } from "./components/edit-profile-form/edit-profile-form"

export const ProfileEdit = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const { user, isLoading, isError, error } = useAdminV2GetSession()

  const { t } = useTranslation()

  useEffect(() => {
    setOpen(true)
  }, [])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        navigate(`/settings/profile`, { replace: true })
      }, 200)
    }

    setOpen(open)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header className="capitalize">
          <Heading>{t("profile.editProfile")}</Heading>
        </Drawer.Header>
        {isLoading || !user ? (
          <div>Loading...</div>
        ) : (
          <EditProfileForm
            user={user}
            usageInsights={false}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
