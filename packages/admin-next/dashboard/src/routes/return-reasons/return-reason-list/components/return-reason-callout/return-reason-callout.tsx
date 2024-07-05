import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export const ReturnReasonCallout = () => {
  const { t } = useTranslation()

  return (
    <Container className="flex items-center justify-between px-6 py-4">
      <div>
        <Heading>Return Reasons</Heading>
        <Text size="small" className="text-ui-fg-subtle text-pretty">
          Manage reasons for returned items.
        </Text>
      </div>
      <Button variant="secondary" size="small" asChild>
        <Link to="create">{t("actions.create")}</Link>
      </Button>
    </Container>
  )
}
