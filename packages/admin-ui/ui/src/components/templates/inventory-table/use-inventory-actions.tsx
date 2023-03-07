import { useNavigate } from "react-router-dom"
import EditIcon from "../../fundamentals/icons/edit-icon"
import { ActionType } from "../../molecules/actionables"

const useProductActions = (inventoryItem) => {
  const navigate = useNavigate()
  const getActions = (): ActionType[] => [
    {
      label: "Go to variant",
      onClick: () =>
        navigate(`/a/products/${inventoryItem.variant.product_id}`),
      icon: <EditIcon size={20} />,
    },
  ]

  return {
    getActions,
  }
}

export default useProductActions
