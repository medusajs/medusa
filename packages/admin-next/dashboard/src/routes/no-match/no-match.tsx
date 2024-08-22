import { ExclamationCircle } from "@medusajs/icons"
import { Button, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

// TODO: Add 404 page
export const NoMatch = () => {
  const { t } = useTranslation()

  const title = t("errorBoundary.notFoundTitle")
  const message = t("errorBoundary.noMatchMessage")

  return (
    <div className="flex size-full min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-y-6">
        <div className="text-ui-fg-subtle flex flex-col items-center gap-y-3">
          <ExclamationCircle />
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Text size="small" leading="compact" weight="plus">
              {title}
            </Text>
            <Text
              size="small"
              className="text-ui-fg-muted text-balance text-center"
            >
              {message}
            </Text>
          </div>
        </div>
        <Button asChild size="small" variant="secondary">
          <Link to="/">{t("errorBoundary.backToDashboard")}</Link>
        </Button>
      </div>
    </div>
  )
}
