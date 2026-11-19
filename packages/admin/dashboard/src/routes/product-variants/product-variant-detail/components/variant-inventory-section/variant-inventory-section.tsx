import { useTranslation } from "react-i18next"

import { Buildings, Component } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"

import { LinkButton } from "../../../../../components/common/link-button"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { usePermissions } from "../../../../../providers/permissions-provider"
import { useInventoryTableColumns } from "./use-inventory-table-columns"

const PAGE_SIZE = 20

type VariantInventorySectionProps = {
  inventoryItems: (HttpTypes.AdminInventoryItem & {
    required_quantity?: number
    variant?: HttpTypes.AdminProductVariant
  })[]
}

export function VariantInventorySection({
  inventoryItems,
}: VariantInventorySectionProps) {
  const { t } = useTranslation()
  const { hasAllPermissions } = usePermissions()

  const canUpdate = hasAllPermissions([
    "inventory_item:create",
    "inventory_item:update",
    "inventory_item:delete",
    "product_variant:update",
  ])

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
          {canUpdate && (
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
          )}
        </div>
      </div>

      <_DataTable
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
  const { hasAllPermissions } = usePermissions()
  // The "edit" link targets the variant edit form (updateProductVariant), which
  // is gated product_variant:update + product:update at the HTTP layer.
  const canUpdate = hasAllPermissions([
    "product:update",
    "product_variant:update",
  ])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-1">
          <Heading level="h2">{t("fields.inventoryItems")}</Heading>
          <span className="txt-small text-ui-fg-subtle">
            {t("products.variant.inventory.notManagedDesc")}
          </span>
        </div>
        {canUpdate && (
          <div className="flex items-center gap-x-4">
            <LinkButton to="edit">
              {t("products.variant.edit.header")}
            </LinkButton>
          </div>
        )}
      </div>
    </Container>
  )
}
