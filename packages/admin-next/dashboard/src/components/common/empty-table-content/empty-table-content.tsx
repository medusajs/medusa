import { ExclamationCircle, MagnifyingGlass, PlusMini } from "@medusajs/icons"
import { Button, Text, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type NoResultsProps = {
  title?: string
  message?: string
  className?: string
}

export const NoResults = ({ title, message, className }: NoResultsProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={clx(
        "flex h-[400px] w-full items-center justify-center",
        className
      )}
    >
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

type ActionProps = {
  action?: {
    to: string
    label: string
  }
}

type NoRecordsProps = {
  title?: string
  message?: string
  className?: string
  buttonVariant?: "default" | "transparent"
} & ActionProps

const DefaultButton = ({ action }: ActionProps) =>
  action && (
    <Button variant="secondary" size="small" asChild>
      <Link to={action.to}>{action.label}</Link>
    </Button>
  )

const TransparentButton = ({ action }: ActionProps) =>
  action && (
    <Button
      variant="transparent"
      size="small"
      className="text-ui-fg-interactive"
      asChild
    >
      <Link to={action.to}>
        <PlusMini /> {action.label}
      </Link>
    </Button>
  )

export const NoRecords = ({
  title,
  message,
  action,
  className,
  buttonVariant = "default",
}: NoRecordsProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={clx(
        "flex h-[400px] w-full flex-col items-center justify-center gap-y-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-y-3">
        <ExclamationCircle />

        <div className="flex flex-col items-center gap-y-1">
          <Text size="small" leading="compact" weight="plus">
            {title ?? t("general.noRecordsTitle")}
          </Text>

          <Text size="small" className="text-ui-fg-muted">
            {message ?? t("general.noRecordsMessage")}
          </Text>
        </div>
      </div>

      {buttonVariant === "default" && <DefaultButton action={action} />}
      {buttonVariant === "transparent" && <TransparentButton action={action} />}
    </div>
  )
}
