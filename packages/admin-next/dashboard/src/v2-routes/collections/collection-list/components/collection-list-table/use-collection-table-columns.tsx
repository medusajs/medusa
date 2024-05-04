import { PencilSquare, Trash } from "@medusajs/icons"
import { ProductCollectionDTO } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteCollection } from "../../../../../hooks/api/collections"

const columnHelper = createColumnHelper<ProductCollectionDTO>()

export const useCollectionTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
      }),
      columnHelper.accessor("handle", {
        header: t("fields.handle"),
        cell: ({ getValue }) => `/${getValue()}`,
      }),
      columnHelper.accessor("products", {
        header: t("fields.products"),
        cell: ({ getValue }) => {
          const count = getValue()?.length

          return <span>{count || "-"}</span>
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CollectionActions collection={row.original} />,
      }),
    ],
    [t]
  )
}

const CollectionActions = ({
  collection,
}: {
  collection: ProductCollectionDTO
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteCollection(collection.id)

  const handleDeleteCollection = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.deleteWarning", {
        title: collection.title,
      }),
      verificationText: collection.title,
      verificationInstruction: t("general.typeToConfirm"),
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
              to: `/collections/${collection.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDeleteCollection,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}
