import { createContext, useState } from "react"

import { ProductCategory } from "@medusajs/medusa"
import { useAdminProductCategories } from "medusa-react"

import Spacer from "../../../components/atoms/spacer"
import BodyCard from "../../../components/organisms/body-card"
import useToggleState from "../../../hooks/use-toggle-state"
import ProductCategoriesList from "../components/product-categories-list"
import CreateProductCategory from "../modals/add-product-category"
import EditProductCategoriesSideModal from "../modals/edit-product-category"
import { flattenCategoryTree } from "../utils"

/**
 * Product categories empty state placeholder.
 */
function ProductCategoriesEmptyState() {
  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <p className="text-grey-40">
        No product categories yet, use the above button to create your first
        category.
      </p>
    </div>
  )
}

export const ProductCategoriesContext = createContext<{
  editCategory: (category: ProductCategory) => void
  createSubCategory: (category: ProductCategory) => void
}>({} as any)

/**
 * Product category index page container.
 */
function ProductCategoryPage() {
  const {
    state: isCreateModalVisible,
    open: showCreateModal,
    close: hideCreateModal,
  } = useToggleState()

  const {
    state: isEditModalVisible,
    open: showEditModal,
    close: hideEditModal,
  } = useToggleState()

  const [activeCategory, setActiveCategory] = useState<ProductCategory>()

  const { product_categories: categories = [], isLoading } =
    useAdminProductCategories({
      parent_category_id: "null",
      include_descendants_tree: true,
    })

  const actions = [
    {
      label: "Add category",
      onClick: showCreateModal,
    },
  ]

  const showPlaceholder = !isLoading && !categories.length

  const editCategory = (category: ProductCategory) => {
    setActiveCategory(category)
    showEditModal()
  }

  const createSubCategory = (category: ProductCategory) => {
    if (isLoading) {
      return
    }
    setActiveCategory(category)
    showCreateModal()
  }

  const flattenedCategories = flattenCategoryTree(categories)
  const context = {
    editCategory,
    createSubCategory,
  }

  return (
    <ProductCategoriesContext.Provider value={context}>
      <div className="flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            className="h-full"
            title="Product Categories"
            subtitle="Helps you to keep your products organized."
            actionables={actions}
            footerMinHeight={40}
            setBorders
          >
            {showPlaceholder ? (
              <ProductCategoriesEmptyState />
            ) : isLoading ? null : (
              <ProductCategoriesList categories={categories!} />
            )}
          </BodyCard>
          <Spacer />
          {isCreateModalVisible && (
            <CreateProductCategory
              parentCategory={activeCategory}
              categories={flattenedCategories}
              closeModal={() => {
                hideCreateModal()
                setActiveCategory(undefined)
              }}
            />
          )}

          <EditProductCategoriesSideModal
            close={hideEditModal}
            activeCategory={activeCategory}
            isVisible={!!activeCategory && isEditModalVisible}
            categories={flattenedCategories}
          />
        </div>
      </div>
    </ProductCategoriesContext.Provider>
  )
}

export default ProductCategoryPage
