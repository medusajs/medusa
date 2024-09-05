import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export const LocationListHeader = () => {
  const { t } = useTranslation()

  return (
    <Container className="flex h-fit items-center justify-between gap-x-4 px-6 py-4">
      <div>
        <Heading>{t("stockLocations.domain")}</Heading>
        <Text className="text-ui-fg-subtle txt-small">
          {t("stockLocations.list.description")}
        </Text>
      </div>
      <Button size="small" className="shrink-0" variant="secondary" asChild>
        <Link to="create">{t("actions.create")}</Link>
      </Button>
    </Container>
  )
}
