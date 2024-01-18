import { Drawer } from "@medusajs/ui"
import { useAdminProductCategory } from "medusa-react"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const CategoryEdit = () => {
  const { id } = useParams()
  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(id!)
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content></Drawer.Content>
    </Drawer>
  )
}
