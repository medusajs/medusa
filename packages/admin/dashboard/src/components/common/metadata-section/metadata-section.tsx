import { ArrowUpRightOnBox } from "@medusajs/icons"
import { Badge, Container, Heading, IconButton } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type MetadataSectionProps<TData extends object> = {
  data: TData
  href?: string
}

export const MetadataSection = <TData extends object>({
  data,
  href = "metadata/edit",
}: MetadataSectionProps<TData>) => {
  const { t } = useTranslation()

  if (!data) {
    return null
  }

  if (!("metadata" in data)) {
    return null
  }

  const numberOfKeys = data.metadata ? Object.keys(data.metadata).length : 0

  return (
    <Container className="flex items-center justify-between">
      <div className="flex items-center gap-x-3">
        <Heading level="h2">{t("metadata.header")}</Heading>
        <Badge size="2xsmall" rounded="full">
          {t("metadata.numberOfKeys", {
            count: numberOfKeys,
          })}
        </Badge>
      </div>
      <IconButton
        size="small"
        variant="transparent"
        className="text-ui-fg-muted hover:text-ui-fg-subtle"
        asChild
      >
        <Link to={href}>
          <ArrowUpRightOnBox />
        </Link>
      </IconButton>
    </Container>
  )
}
