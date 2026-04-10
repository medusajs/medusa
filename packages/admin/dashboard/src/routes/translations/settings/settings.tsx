import { Heading } from "@medusajs/ui"
import { Spinner } from "@medusajs/icons"
import { RouteDrawer } from "../../../components/modals"
import { useTranslationSettings } from "../../../hooks/api/translations"
import { BatchTranslationSettingsForm } from "./components/batch-translation-settings-form/batch-translation-settings-form"

export const Settings = () => {
  const { translation_settings, isPending, isError, error } =
    useTranslationSettings()

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Manage translatable entities</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>
      {isPending ? (
        <RouteDrawer.Body className="flex h-full items-center justify-center">
          <Spinner className="animate-spin" />
        </RouteDrawer.Body>
      ) : (
        translation_settings && (
          <BatchTranslationSettingsForm
            translation_settings={translation_settings}
          />
        )
      )}
    </RouteDrawer>
  )
}
