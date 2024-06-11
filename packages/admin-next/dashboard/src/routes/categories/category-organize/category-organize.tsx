import { RouteFocusModal } from "../../../components/route-modal"
import { OrganizeCategoryForm } from "./components/organize-category-form/organize-category-form"

// TODO: Something around the mpath of categories is bugged out, and using this form breaks your categories. See CORE-2287.
export const CategoryOrganize = () => {
  return (
    <RouteFocusModal>
      <OrganizeCategoryForm />
    </RouteFocusModal>
  )
}
