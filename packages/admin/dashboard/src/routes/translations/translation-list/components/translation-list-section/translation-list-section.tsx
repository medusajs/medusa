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
          className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-6 py-4 sm:grid-cols-[minmax(0,250px)_1fr_auto]"
        >
          <Text size="small" weight="plus">
            {entity.label}
          </Text>
          <Text
            size="small"
            className="text-ui-fg-subtle col-start-1 row-start-2 sm:col-start-2 sm:row-start-1"
          >
            {t("translations.list.metrics", {
              translated: (entity.translatedCount ?? 0).toLocaleString(),
              total: (entity.totalCount ?? 0).toLocaleString(),
            })}
          </Text>
          {!hasLocales || !entity.totalCount ? (
            <Button
              variant="secondary"
              size="small"
              disabled
              className="col-start-2 row-start-1 sm:col-start-3"
            >
              {t("actions.edit")}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="small"
              className="col-start-2 row-start-1 sm:col-start-3"
              asChild
            >
              <Link
                to={`/settings/translations/edit?reference=${entity.reference}`}
              >
                {t("actions.edit")}
              </Link>
            </Button>
          )}
        </div>
      ))}
    </Container>
  )
}
