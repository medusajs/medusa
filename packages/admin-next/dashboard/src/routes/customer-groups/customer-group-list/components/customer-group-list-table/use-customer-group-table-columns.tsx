import { PencilSquare, Trash } from "@medusajs/icons"
import { CustomerGroup } from "@medusajs/medusa"
import { usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminDeleteCustomerGroup } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

const columnHelper = createColumnHelper<CustomerGroup>()

export const useCustomerGroupTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("customers", {
        header: t("customers.domain"),
        cell: ({ getValue }) => {
          const count = getValue()?.length ?? 0

          return count
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CustomerGroupActions group={row.original} />,
      }),
    ],
    [t]
  )
}

const CustomerGroupActions = ({ group }: { group: CustomerGroup }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteCustomerGroup(group.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("customerGroups.deleteCustomerGroupWarning", {
        name: group.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              to: `/customer-groups/${group.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}
