import { User } from "@medusajs/medusa"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type UserGeneralSection = {
  user: Omit<User, "password_hash">
}

export const UserGeneralSection = ({ user }: UserGeneralSection) => {
  const { t } = useTranslation()

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")

  return (
    <Container className="p-0 divide-y">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{user.email}</Heading>
        <Link to={`edit`}>
          <Button size="small" variant="secondary">
            {t("general.edit")}
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 px-6 py-4 items-center">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text
          size="small"
          leading="compact"
          className={clx({
            "text-ui-fg-subtle": !name,
          })}
        >
          {name ?? "-"}
        </Text>
      </div>
      <div className="grid grid-cols-2 px-6 py-4 items-center">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.role")}
        </Text>
        <Text size="small" leading="compact">
          {t(`users.roles.${user.role}`)}
        </Text>
      </div>
    </Container>
  )
}
