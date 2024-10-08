import { Button, Heading, toast } from "@medusajs/ui"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useTranslation } from "react-i18next"
import { ExportFilters } from "./components/export-filters"
import { useExportProducts } from "../../../hooks/api"
import { useProductTableQuery } from "../../../hooks/table/query"

export const ProductExport = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("products.export.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("products.export.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <ProductExportContent />
    </RouteDrawer>
  )
}

const ProductExportContent = () => {
  const { t } = useTranslation()
  const { searchParams } = useProductTableQuery({})
  const { mutateAsync } = useExportProducts(searchParams)
  const { handleSuccess } = useRouteModal()

  const handleExportRequest = async () => {
    await mutateAsync(
      {},
      {
        onSuccess: () => {
          toast.info(t("products.export.success.title"), {
            description: t("products.export.success.description"),
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
        {/* <Divider className="mt-4" variant="dashed" /> */}
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
