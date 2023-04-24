import React from "react"
import { useSelectedVendor } from "../../../context/vendor"
import { useAdminDeleteCollection } from "medusa-react"
import { useNavigate } from "react-router-dom"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { ActionType } from "../../molecules/actionables"
import { useUserPermissions } from "../../../hooks/use-permissions"

const useCollectionActions = (collection) => {
  const navigate = useNavigate()
  const dialog = useImperativeDialog()
  const deleteCollection = useAdminDeleteCollection(collection?.id)
  const { isAdmin } = useUserPermissions()
  const { isStoreView } = useSelectedVendor()

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Collection",
      text: "Are you sure you want to delete this collection?",
    })

    if (shouldDelete) {
      deleteCollection.mutate()
    }
  }

  const getActions = (collection): ActionType[] => {
    const storeActions: ActionType[] = [
      {
        label: "Edit",
        onClick: () => navigate(`/admin/collections/${collection.id}`),
        icon: <EditIcon size={20} />,
      },
    ]

    return [
      ...(isStoreView || isAdmin ? storeActions : []),
      {
        label: "Delete",
        variant: "danger",
        onClick: handleDelete,
        icon: <TrashIcon size={20} />,
      },
    ]
  }

  return {
    getActions,
  }
}

export default useCollectionActions
