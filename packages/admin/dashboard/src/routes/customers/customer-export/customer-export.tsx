import { Button, Heading, Label, Select, Text, toast } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { HttpTypes } from "@medusajs/types"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useExportCustomers } from "../../../hooks/api"
import { useCustomerTableQuery } from "../../../hooks/table/query"
import { ExportFilters } from "./components/export-filters"

type ExportFormat = NonNullable<HttpTypes.AdminExportCustomerRequest["format"]>

export const CustomerExport = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("customers.export.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("customers.export.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <CustomerExportContent />
    </RouteDrawer>
  )
}

const CustomerExportContent = () => {
  const { t } = useTranslation()
  const { searchParams } = useCustomerTableQuery({})

  const [format, setFormat] = useState<ExportFormat>("json")

  const { mutateAsync } = useExportCustomers()
  const { handleSuccess } = useRouteModal()

  const handleExportRequest = async () => {
    await mutateAsync(
      {
        payload: { format },
        query: searchParams,
      },
      {
        onSuccess: () => {
          toast.info(t("customers.export.success.title"), {
            description: t("customers.export.success.description"),
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
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="export-format" weight="plus" size="small">
            {t("customers.export.format.label")}
          </Label>
          <Text size="small" className="text-ui-fg-subtle">
            {t("customers.export.format.description")}
          </Text>
          <Select value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
            <Select.Trigger id="export-format">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="json">
                {t("customers.export.format.json")}
              </Select.Item>
              <Select.Item value="csv">
                {t("customers.export.format.csv")}
              </Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div className="mt-6">
          <ExportFilters />
        </div>
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
