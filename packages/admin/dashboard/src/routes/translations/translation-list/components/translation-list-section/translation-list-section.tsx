import { Button, Container, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"
import { TranslatableEntity } from "../../translation-list"
import { useTranslation } from "react-i18next"

type TranslationListSectionProps = {
  entities: TranslatableEntity[]
  hasLocales: boolean
}

export const TranslationListSection = ({
  entities,
  hasLocales = false,
}: TranslationListSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      {entities.map((entity) => (
        <div
          key={entity.reference}
          className="grid grid-cols-[250px_1fr_auto] items-center gap-x-4 px-6 py-4"
        >
          <Text size="small" weight="plus">
            {entity.label}
          </Text>
          <Text size="small" className="text-ui-fg-subtle">
            {t("translations.list.metrics", {
              translated: (entity.translatedCount ?? 0).toLocaleString(),
              total: (entity.totalCount ?? 0).toLocaleString(),
            })}
          </Text>
          <Link
            to={`/settings/translations/edit?reference=${entity.reference}`}
          >
            <Button
              variant="secondary"
              size="small"
              disabled={!hasLocales || !entity.totalCount}
            >
              Edit
            </Button>
          </Link>
        </div>
      ))}
    </Container>
  )
}
