import { Container, Heading, Text } from "@medusajs/ui"

import { Spinner } from "@medusajs/icons"
import { useAdminGetSession } from "medusa-react"
import { useTranslation } from "react-i18next"
import { languages } from "../../../../i18n/config"
import { EditProfileDetailsDrawer } from "../../components/edit-profile-details-drawer/edit-profile-details-drawer"

export const Profile = () => {
  const { user, isLoading } = useAdminGetSession()
  const { i18n, t } = useTranslation()

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Container className="divide-ui-border-base divide-y p-0">
        <div className="px-6 py-4">
          <Heading>{t("profile.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("profile.manageYourProfileDetails")}
          </Text>
        </div>
        <div className="grid grid-cols-2 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Name
          </Text>
          <Text size="small" leading="compact">
            {user.first_name} {user.last_name}
          </Text>
        </div>
        <div className="grid grid-cols-2 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Email
          </Text>
          <Text size="small" leading="compact">
            {user.email}
          </Text>
        </div>
        <div className="grid grid-cols-2 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Language
          </Text>
          <Text size="small" leading="compact">
            {languages.find((lang) => lang.code === i18n.language)
              ?.display_name || "-"}
          </Text>
        </div>
        <div className="grid grid-cols-2 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Usage insights
          </Text>
        </div>
        <div className="flex items-center justify-end px-6 py-4">
          <EditProfileDetailsDrawer
            id={user.id}
            firstName={user.first_name}
            lastName={user.last_name}
          />
        </div>
      </Container>
    </div>
  )
}
