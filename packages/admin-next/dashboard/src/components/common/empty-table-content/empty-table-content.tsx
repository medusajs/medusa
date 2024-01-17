import { ExclamationCircle, MagnifyingGlass } from "@medusajs/icons"
import { Button, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type NoResultsProps = {
  title?: string
  message?: string
}

export const NoResults = ({ title, message }: NoResultsProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-y-2">
        <MagnifyingGlass />
        <Text size="small" leading="compact" weight="plus">
          {title ?? t("general.noResultsTitle")}
        </Text>
        <Text size="small" className="text-ui-fg-subtle">
          {message ?? t("general.noResultsMessage")}
        </Text>
      </div>
    </div>
  )
}

type NoRecordsProps = {
  title?: string
  message?: string
  action?: {
    to: string
    label: string
  }
}

export const NoRecords = ({ title, message, action }: NoRecordsProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-y-6">
      <div className="flex flex-col items-center gap-y-2">
        <ExclamationCircle />
        <Text size="small" leading="compact" weight="plus">
          {title ?? t("general.noRecordsTitle")}
        </Text>
        <Text size="small" className="text-ui-fg-subtle">
          {message ?? t("general.noRecordsMessage")}
        </Text>
      </div>
      {action && (
        <Link to={action.to}>
          <Button variant="secondary" size="small">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  )
}
