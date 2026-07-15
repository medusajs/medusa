import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { Alert, Button, Container, Heading, Text } from "@medusajs/ui"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import {
  useStore,
  useTranslationSettings,
  useTranslationStatistics,
} from "../../../hooks/api"
import { ActiveLocalesSection } from "./components/active-locales-section/active-locales-section"
import { TranslationListSection } from "./components/translation-list-section/translation-list-section"
import { TranslationsCompletionSection } from "./components/translations-completion-section/translations-completion-section"
import { ListCheckbox } from "@medusajs/icons"
import {
  useStorePermissions,
  useTranslationSettingPermissions,
} from "../../../hooks/use-resource-permissions"
import { PermissionGuard } from "../../../components/common/permission-guard"

export type TranslatableEntity = {
  label: string
  reference: string
  translatableFields: string[]
  translatedCount?: number
  totalCount?: number
}

export const TranslationList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { canUpdate: canManageLocales } = useStorePermissions()
  const {
    canCreate: canCreateSettings,
    canUpdate: canUpdateSettings,
    canDelete: canDeleteSettings,
    canRead: canReadTranslationSettings,
  } = useTranslationSettingPermissions()
  const canManageEntities =
    canCreateSettings && canUpdateSettings && canDeleteSettings
  const { canRead: canReadStore } = useStorePermissions()

  const { store, isPending, isError, error } = useStore(undefined, {
    enabled: canReadStore,
  })
  const {
    translation_settings,
    isPending: isTranslationSettingsPending,
    isError: isTranslationSettingsError,
    error: translationSettingsError,
  } = useTranslationSettings(
    {
      is_active: true,
    },
    {
      enabled: canReadTranslationSettings,
    }
  )
  const {
    statistics,
    isPending: isTranslationStatisticsPending,
    isError: isTranslationStatisticsError,
    error: translationStatisticsError,
  } = useTranslationStatistics(
    {
      locales:
        store?.supported_locales?.map(
          (suportedLocale) => suportedLocale.locale_code
        ) ?? [],
      entity_types: Object.keys(translation_settings ?? {}),
    },
    {
      enabled:
        !!translation_settings &&
        !!store &&
        store.supported_locales?.length > 0,
    }
  )

  if (isError || isTranslationSettingsError || isTranslationStatisticsError) {
    throw error || translationSettingsError || translationStatisticsError
  }

  const hasLocales = (store?.supported_locales ?? []).length > 0

  const translatableEntities: TranslatableEntity[] = useMemo(() => {
    if (!translation_settings) {
      return []
    }

    return (
      Object.entries(translation_settings)
        .map(([entity, setting]) => {
          const entityStatistics = statistics?.[entity] ?? {
            translated: 0,
            expected: 0,
          }

          return {
            label: entity
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            reference: entity,
            translatableFields: setting.fields,
            translatedCount: entityStatistics.translated,
            totalCount: entityStatistics.expected,
          }
        })
        // sort by label alphabetically
        .sort((a, b) => a.label.localeCompare(b.label))
    )
  }, [translation_settings, statistics])

  const handleManageLocales = useCallback(() => {
    navigate("/settings/translations/add-locales")
  }, [navigate])

  const handleManageEntities = useCallback(() => {
    navigate("/settings/translations/settings")
  }, [navigate])

  const isReady =
    !!store &&
    !isPending &&
    !isTranslationSettingsPending &&
    !!translation_settings &&
    ((!!statistics && !isTranslationStatisticsPending) || !hasLocales)

  if (!isReady) {
    return <TwoColumnPageSkeleton sidebarSections={2} />
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="translation.list"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="translations-header">
              <Container className="flex items-center justify-between px-6 py-4">
                <div className="flex flex-col">
                  <Heading>Manage {t("translations.domain")}</Heading>
                  <Text className="text-ui-fg-subtle" size="small">
                    {t("translations.subtitle")}
                  </Text>
                </div>
                {canManageEntities && (
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={handleManageEntities}
                  >
                    <ListCheckbox className="text-ui-fg-subtle" />
                    <Text className="txt-compact-small-plus text-ui-fg-base">
                      {t("translations.actions.manageEntities")}
                    </Text>
                  </Button>
                )}
              </Container>
            </LayoutComposer.Entry>

            {!hasLocales && (
              <LayoutComposer.Entry id="no-locales-alert">
                <Alert
                  variant="info"
                  className="bg-ui-bg-base flex items-center px-6 py-4"
                >
                  <div className="flex items-center justify-between gap-x-2">
                    <p>{t("translations.activeLocales.noLocalesTip")}.</p>
                    {canManageLocales && (
                      <Button
                        onClick={handleManageLocales}
                        size="small"
                        variant="secondary"
                      >
                        {t(
                          "translations.activeLocales.noLocalesTipConfigureAction"
                        )}
                      </Button>
                    )}
                  </div>
                </Alert>
              </LayoutComposer.Entry>
            )}

            <LayoutComposer.Entry id="TranslationListSection">
              <TranslationListSection
                entities={translatableEntities}
                hasLocales={hasLocales}
              />
            </LayoutComposer.Entry>
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="ActiveLocalesSection">
              <PermissionGuard permission="store:read">
                <ActiveLocalesSection
                  locales={
                    store?.supported_locales?.map(
                      (suportedLocale) => suportedLocale.locale
                    ) ?? []
                  }
                ></ActiveLocalesSection>
              </PermissionGuard>
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="TranslationsCompletionSection">
              <PermissionGuard permission="store:read">
                <TranslationsCompletionSection
                  statistics={statistics ?? {}}
                  locales={
                    store?.supported_locales?.map(
                      (supportedLocale) => supportedLocale.locale
                    ) ?? []
                  }
                />
              </PermissionGuard>
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
