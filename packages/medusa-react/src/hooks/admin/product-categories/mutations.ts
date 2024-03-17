import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { Response } from "@medusajs/medusa-js"
import {
  AdminDeleteProductCategoriesCategoryProductsBatchReq,
  AdminPostProductCategoriesCategoryProductsBatchReq,
  AdminPostProductCategoriesCategoryReq,
  AdminPostProductCategoriesReq,
  AdminProductCategoriesCategoryDeleteRes,
  AdminProductCategoriesCategoryRes,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductCategoryKeys } from "./queries"
import { adminProductKeys } from "../products"

/**
 * This hook creates a product category.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateProductCategory } from "medusa-react"
 *
 * const CreateCategory = () => {
 *   const createCategory = useAdminCreateProductCategory()
 *   // ...
 *
 *   const handleCreate = (
 *     name: string
 *   ) => {
 *     createCategory.mutate({
 *       name,
 *     }, {
 *       onSuccess: ({ product_category }) => {
 *         console.log(product_category.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateCategory
 *
 * @customNamespace Hooks.Admin.Product Categories
 * @category Mutations
 */
export const useAdminCreateProductCategory = (
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    AdminPostProductCategoriesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostProductCategoriesReq) =>
      client.admin.productCategories.create(payload),
    ...buildOptions(
      queryClient,
      [adminProductCategoryKeys.list(), adminProductKeys.details()],
      options
    ),
  })
}

/**
 * This hook updates a product category.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateProductCategory } from "medusa-react"
 *
 * type Props = {
 *   productCategoryId: string
 * }
 *
 * const Category = ({
 *   productCategoryId
 * }: Props) => {
 *   const updateCategory = useAdminUpdateProductCategory(
 *     productCategoryId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     name: string
 *   ) => {
 *     updateCategory.mutate({
 *       name,
 *     }, {
 *       onSuccess: ({ product_category }) => {
 *         console.log(product_category.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Category
 *
 * @customNamespace Hooks.Admin.Product Categories
 * @category Mutations
 */
export const useAdminUpdateProductCategory = (
  /**
   * The product category's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    AdminPostProductCategoriesCategoryReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostProductCategoriesCategoryReq) =>
      client.admin.productCategories.update(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminProductCategoryKeys.lists(),
        adminProductCategoryKeys.detail(id),
        adminProductKeys.details(),
      ],
      options
    ),
  })
}

/**
 * This hook deletes a product category. This does not delete associated products.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteProductCategory } from "medusa-react"
 *
 * type Props = {
 *   productCategoryId: string
 * }
 *
 * const Category = ({
 *   productCategoryId
 * }: Props) => {
 *   const deleteCategory = useAdminDeleteProductCategory(
 *     productCategoryId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteCategory.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Category
 *
 * @customNamespace Hooks.Admin.Product Categories
 * @category Mutations
 */
export const useAdminDeleteProductCategory = (
  /**
   * The product category's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.productCategories.delete(id),
    ...buildOptions(
      queryClient,
      [
        adminProductCategoryKeys.lists(),
        adminProductCategoryKeys.detail(id),
        adminProductKeys.all,
      ],
      options
    ),
  })
}

/**
 * This hook adds a list of products to a product category.
 *
 * @example
 * import React from "react"
 * import { useAdminAddProductsToCategory } from "medusa-react"
 *
 * type ProductsData = {
 *   id: string
 * }
 *
 * type Props = {
 *   productCategoryId: string
 * }
 *
 * const Category = ({
 *   productCategoryId
 * }: Props) => {
 *   const addProducts = useAdminAddProductsToCategory(
 *     productCategoryId
 *   )
 *   // ...
 *
 *   const handleAddProducts = (
 *     productIds: ProductsData[]
 *   ) => {
 *     addProducts.mutate({
 *       product_ids: productIds
 *     }, {
 *       onSuccess: ({ product_category }) => {
 *         console.log(product_category.products)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Category
 *
 * @customNamespace Hooks.Admin.Product Categories
 * @category Mutations
 */
export const useAdminAddProductsToCategory = (
  /**
   * The product category's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    AdminPostProductCategoriesCategoryProductsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      payload: AdminPostProductCategoriesCategoryProductsBatchReq
    ) => {
      return client.admin.productCategories.addProducts(id, payload)
    },
    ...buildOptions(
      queryClient,
      [
        adminProductCategoryKeys.lists(),
        adminProductCategoryKeys.detail(id),
        adminProductKeys.list({ product_category_id: [id] }),
      ],
      options
    ),
  })
}

/**
 * This hook removes a list of products from a product category.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteProductsFromCategory } from "medusa-react"
 *
 * type ProductsData = {
 *   id: string
 * }
 *
 * type Props = {
 *   productCategoryId: string
 * }
 *
 * const Category = ({
 *   productCategoryId
 * }: Props) => {
 *   const deleteProducts = useAdminDeleteProductsFromCategory(
 *     productCategoryId
 *   )
 *   // ...
 *
 *   const handleDeleteProducts = (
 *     productIds: ProductsData[]
 *   ) => {
 *     deleteProducts.mutate({
 *       product_ids: productIds
 *     }, {
 *       onSuccess: ({ product_category }) => {
 *         console.log(product_category.products)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Category
 *
 * @customNamespace Hooks.Admin.Product Categories
 * @category Mutations
 */
export const useAdminDeleteProductsFromCategory = (
  /**
   * The product category's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductCategoriesCategoryRes>,
    Error,
    AdminDeleteProductCategoriesCategoryProductsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      payload: AdminDeleteProductCategoriesCategoryProductsBatchReq
    ) => {
      return client.admin.productCategories.removeProducts(id, payload)
    },
    ...buildOptions(
      queryClient,
      [
        adminProductCategoryKeys.lists(),
        adminProductCategoryKeys.detail(id),
        adminProductKeys.list({ product_category_id: [id] }),
      ],
      options
    ),
  })
}
