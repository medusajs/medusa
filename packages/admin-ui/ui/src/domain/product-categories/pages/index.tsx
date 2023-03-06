import { createContext } from "react"

import BodyCard from "../../../components/organisms/body-card"

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

export const ProductCategoriesContext = createContext<{}>({} as any)

/**
 * Product category index page container.
 */
function ProductCategoryPage() {
  const actions = [
    {
      label: "Add category",
      onClick: () => {},
    },
  ]

  const context = {}

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
            <ProductCategoriesEmptyState />
          </BodyCard>
        </div>
      </div>
    </ProductCategoriesContext.Provider>
  )
}

export default ProductCategoryPage
