import { ExclamationCircle } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const NoPermissions = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4">
      <Container className="max-w-md">
        <div className="flex flex-col items-center gap-y-4 py-8 text-center">
          <div className="bg-ui-bg-subtle flex h-12 w-12 items-center justify-center rounded-full">
            <ExclamationCircle className="text-ui-fg-muted" />
          </div>
          <div className="flex flex-col gap-y-1">
            <Heading level="h2">{t("permissions.noPermissions.title")}</Heading>
            <Text className="text-ui-fg-subtle">
              {t("permissions.noPermissions.description")}
            </Text>
          </div>
        </div>
      </Container>
    </div>
  )
}
