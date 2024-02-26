import { Heading } from "@medusajs/ui"
import { useAdminGetSession } from "medusa-react"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/route-modal"
import { EditProfileForm } from "./components/edit-profile-form/edit-profile-form"

export const ProfileEdit = () => {
  const { user, isLoading, isError, error } = useAdminGetSession()


  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header className="capitalize">
        <Heading>{t("profile.editProfile")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && user && (
        <EditProfileForm user={user} usageInsights={false} />
      )}
    </RouteDrawer>
  )
}
