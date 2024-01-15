import { User } from "@medusajs/medusa"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type UserGeneralSection = {
  user: Omit<User, "password_hash">
}

export const UserGeneralSection = ({ user }: UserGeneralSection) => {
  const { t } = useTranslation()
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("profile.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("profile.manageYourProfileDetails")}
          </Text>
        </div>
        <Link to={`edit`}>
          <Button size="small" variant="secondary">
            {t("profile.editProfile")}
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {user.first_name} {user.last_name}
        </Text>
      </div>
      <div className="grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.email")}
        </Text>
        <Text size="small" leading="compact">
          {user.email}
        </Text>
      </div>
    </Container>
  )
}
