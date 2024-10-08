import { useTranslation } from "react-i18next"

import { Buildings, Component } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"

import { useDataTable } from "../../../../../hooks/use-data-table"
import { useInventoryTableColumns } from "./use-inventory-table-columns"
import { LinkButton } from "../../../../../components/common/link-button"

const PAGE_SIZE = 20

type VariantInventorySectionProps = {
  inventoryItems: HttpTypes.AdminInventoryItem[]
}

export function VariantInventorySection({
  inventoryItems,
}: VariantInventorySectionProps) {
  const { t } = useTranslation()

  const columns = useInventoryTableColumns()

  const { table } = useDataTable({
    data: inventoryItems ?? [],
    columns,
    count: inventoryItems.length,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  const hasKit = inventoryItems.length > 1

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Heading level="h2">{t("fields.inventoryItems")}</Heading>
        </div>
        <div className="flex items-center gap-x-4">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t(
                      hasKit
                        ? "products.variant.inventory.manageKit"
                        : "products.variant.inventory.manageItems"
                    ),
                    to: "manage-items",
                    icon: hasKit ? <Component /> : <Buildings />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={inventoryItems.length}
        navigateTo={(row) => `/inventory/${row.id}`}
      />
    </Container>
  )
}

export function InventorySectionPlaceholder() {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-1">
          <Heading level="h2">{t("fields.inventoryItems")}</Heading>
          <span className="txt-small text-ui-fg-subtle">
            {t("products.variant.inventory.notManagedDesc")}
          </span>
        </div>
        <div className="flex items-center gap-x-4">
          <LinkButton to="edit">{t("products.variant.edit.header")}</LinkButton>
        </div>
      </div>
    </Container>
  )
}
