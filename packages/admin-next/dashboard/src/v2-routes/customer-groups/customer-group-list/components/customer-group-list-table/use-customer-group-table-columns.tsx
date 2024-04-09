import { PencilSquare, Trash } from "@medusajs/icons"
import { usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { AdminCustomerGroupResponse } from "@medusajs/types"
import { useDeleteCustomerGroup } from "../../../../../hooks/api/customer-groups"

const columnHelper =
  createColumnHelper<AdminCustomerGroupResponse["customer_group"]>()

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

const CustomerGroupActions = ({
  group,
}: {
  group: AdminCustomerGroupResponse["customer_group"]
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteCustomerGroup(group.id)

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
