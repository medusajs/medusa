import { HttpTypes } from "@medusajs/types"
import { Button, Heading, toast } from "@medusajs/ui"
import { useSearchParams } from "react-router-dom"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useTranslation } from "react-i18next"
import { ExportFilters } from "./components/export-filters"
import { useExportProducts } from "../../../hooks/api"
import {
  parsePrefixedQueryParams,
  useProductTableQuery,
} from "../../../hooks/table/query"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"

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
  const exportQuery = useExportQuery()

  const { mutateAsync } = useExportProducts()
  const { handleSuccess } = useRouteModal()

  const handleExportRequest = async () => {
    await mutateAsync(
      {
        payload: {},
        query: exportQuery,
      },
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

const PRODUCT_TABLE_QUERY_PREFIX = "p"

const useExportQuery = (): HttpTypes.AdminProductListParams => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")
  const [urlSearchParams] = useSearchParams()
  const { searchParams } = useProductTableQuery({})

  if (isViewConfigEnabled) {
    return parsePrefixedQueryParams(urlSearchParams, PRODUCT_TABLE_QUERY_PREFIX)
  }

  const { fields: _fields, ...query } = searchParams
  return query
}
