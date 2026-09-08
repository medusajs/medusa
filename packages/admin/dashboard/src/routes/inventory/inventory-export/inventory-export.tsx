import { Button, Heading, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useExportInventoryItems } from "../../../hooks/api/inventory"
import { useInventoryTableQuery } from "../inventory-list/components/use-inventory-table-query"
import { ExportFilters } from "./components/export-filters"

export const InventoryExport = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("inventory.export.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("inventory.export.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <InventoryExportContent />
    </RouteDrawer>
  )
}

const InventoryExportContent = () => {
  const { t } = useTranslation()
  const { searchParams } = useInventoryTableQuery({})

  const { mutateAsync } = useExportInventoryItems()
  const { handleSuccess } = useRouteModal()

  const handleExportRequest = async () => {
    await mutateAsync(
      {
        payload: {},
        query: searchParams,
      },
      {
        onSuccess: () => {
          toast.info(t("inventory.export.success.title"), {
            description: t("inventory.export.success.description"),
          })
          handleSuccess()
        },
        onError: (err) => {
          toast.error(err.message)
        },
      }
    )
  }

  return (
    <>
      <RouteDrawer.Body>
        <ExportFilters />
      </RouteDrawer.Body>
      <RouteDrawer.Footer>
        <div className="flex items-center gap-x-2">
          <RouteDrawer.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </RouteDrawer.Close>
          <Button onClick={handleExportRequest} size="small">
            {t("actions.export")}
          </Button>
        </div>
      </RouteDrawer.Footer>
    </>
  )
}
