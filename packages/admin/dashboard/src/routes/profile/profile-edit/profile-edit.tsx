import { Heading } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/modals"
import { useMe } from "../../../hooks/api/users"
import { EditProfileForm } from "./components/edit-profile-form/edit-profile-form"

export const ProfileEdit = () => {
  const { user, isPending: isLoading, isError, error } = useMe()

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header className="capitalize">
        <RouteDrawer.Title asChild>
          <Heading>{t("profile.edit.header")}</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>
      {!isLoading && user && <EditProfileForm user={user} />}
    </RouteDrawer>
  )
}
