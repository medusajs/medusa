import {
  AdminPostProductsProductOptionsOption,
  AdminPostProductsProductOptionsReq,
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  AdminPostProductsReq,
  AdminProductsDeleteOptionRes,
  AdminProductsDeleteRes,
  AdminProductsDeleteVariantRes,
  AdminProductsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductKeys } from "./queries"

/**
 * This hook creates a new Product. This hook can also be used to create a gift card if the `is_giftcard` field is set to `true`.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateProduct } from "medusa-react"
 *
 * type CreateProductData = {
 *   title: string
 *   is_giftcard: boolean
 *   discountable: boolean
 *   options: {
 *     title: string
 *   }[]
 *   variants: {
 *     title: string
 *     prices: {
 *       amount: number
 *       currency_code :string
 *     }[]
 *     options: {
 *       value: string
 *     }[]
 *   }[],
 *   collection_id: string
 *   categories: {
 *     id: string
 *   }[]
 *   type: {
 *     value: string
 *   }
 *   tags: {
 *     value: string
 *   }[]
 * }
 *
 * const CreateProduct = () => {
 *   const createProduct = useAdminCreateProduct()
 *   // ...
 *
 *   const handleCreate = (productData: CreateProductData) => {
 *     createProduct.mutate(productData, {
 *       onSuccess: ({ product }) => {
 *         console.log(product.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateProduct
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminCreateProduct = (
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostProductsReq) =>
      client.admin.products.create(payload),
    ...buildOptions(queryClient, adminProductKeys.lists(), options),
  })
}

/**
 * This hook updates a Product's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateProduct } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 * }
 *
 * const Product = ({ productId }: Props) => {
 *   const updateProduct = useAdminUpdateProduct(
 *     productId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     title: string
 *   ) => {
 *     updateProduct.mutate({
 *       title,
 *     }, {
 *       onSuccess: ({ product }) => {
 *         console.log(product.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Product
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminUpdateProduct = (
  /**
   * The product's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsProductReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostProductsProductReq) =>
      client.admin.products.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a product and its associated product variants and options.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteProduct } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 * }
 *
 * const Product = ({ productId }: Props) => {
 *   const deleteProduct = useAdminDeleteProduct(
 *     productId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteProduct.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted}) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Product
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminDeleteProduct = (
  /**
   * The product's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminProductsDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.products.delete(id),
    ...buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook creates a product variant associated with a product. Each product variant must have a unique combination of product option values.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateVariant } from "medusa-react"
 *
 * type CreateVariantData = {
 *   title: string
 *   prices: {
 *     amount: number
 *     currency_code: string
 *   }[]
 *   options: {
 *     option_id: string
 *     value: string
 *   }[]
 * }
 *
 * type Props = {
 *   productId: string
 * }
 *
 * const CreateProductVariant = ({ productId }: Props) => {
 *   const createVariant = useAdminCreateVariant(
 *     productId
 *   )
 *   // ...
 *
 *   const handleCreate = (
 *     variantData: CreateVariantData
 *   ) => {
 *     createVariant.mutate(variantData, {
 *       onSuccess: ({ product }) => {
 *         console.log(product.variants)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateProductVariant
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminCreateVariant = (
  /**
   * The product's ID.
   */
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsProductVariantsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostProductsProductVariantsReq) =>
      client.admin.products.createVariant(productId, payload),
    ...buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(productId)],
      options
    ),
  })
}

export type AdminUpdateVariantReq =
  AdminPostProductsProductVariantsVariantReq & {
    /**
     * The product variant's ID.
     */
    variant_id: string
  }

/**
 * This hook updates a product variant's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateVariant } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 *   variantId: string
 * }
 *
 * const ProductVariant = ({
 *   productId,
 *   variantId
 * }: Props) => {
 *   const updateVariant = useAdminUpdateVariant(
 *     productId
 *   )
 *   // ...
 *
 *   const handleUpdate = (title: string) => {
 *     updateVariant.mutate({
 *       variant_id: variantId,
 *       title,
 *     }, {
 *       onSuccess: ({ product }) => {
 *         console.log(product.variants)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ProductVariant
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminUpdateVariant = (
  /**
   * The product's ID.
   */
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminUpdateVariantReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ variant_id, ...payload }: AdminUpdateVariantReq) =>
      client.admin.products.updateVariant(productId, variant_id, payload),
    ...buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(productId)],
      options
    ),
  })
}

/**
 * This hook deletes a product variant.
 *
 * @typeParamDefinition string - The ID of the product variant to delete.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteVariant } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 *   variantId: string
 * }
 *
 * const ProductVariant = ({
 *   productId,
 *   variantId
 * }: Props) => {
 *   const deleteVariant = useAdminDeleteVariant(
 *     productId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteVariant.mutate(variantId, {
 *       onSuccess: ({ variant_id, object, deleted, product }) => {
 *         console.log(product.variants)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ProductVariant
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminDeleteVariant = (
  /**
   * The product's ID.
   */
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsDeleteVariantRes>,
    Error,
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variantId: string) =>
      client.admin.products.deleteVariant(productId, variantId),
    ...buildOptions(
      queryClient,
      [adminProductKeys.lists(), adminProductKeys.detail(productId)],
      options
    ),
  })
}

/**
 * This hook adds a product option to a product.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateProductOption } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 * }
 *
 * const CreateProductOption = ({ productId }: Props) => {
 *   const createOption = useAdminCreateProductOption(
 *     productId
 *   )
 *   // ...
 *
 *   const handleCreate = (
 *     title: string
 *   ) => {
 *     createOption.mutate({
 *       title
 *     }, {
 *       onSuccess: ({ product }) => {
 *         console.log(product.options)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateProductOption
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminCreateProductOption = (
  /**
   * The product's ID.
   */
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminPostProductsProductOptionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostProductsProductOptionsReq) =>
      client.admin.products.addOption(productId, payload),
    ...buildOptions(queryClient, adminProductKeys.detail(productId), options),
  })
}

export type AdminUpdateProductOptionReq =
  AdminPostProductsProductOptionsOption & {
    /**
     * The ID of the product option to update.
     */
    option_id: string
  }

/**
 * This hook updates a product option's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateProductOption } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 *   optionId: string
 * }
 *
 * const ProductOption = ({
 *   productId,
 *   optionId
 * }: Props) => {
 *   const updateOption = useAdminUpdateProductOption(
 *     productId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     title: string
 *   ) => {
 *     updateOption.mutate({
 *       option_id: optionId,
 *       title,
 *     }, {
 *       onSuccess: ({ product }) => {
 *         console.log(product.options)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ProductOption
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminUpdateProductOption = (
  /**
   * The product's ID.
   */
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsRes>,
    Error,
    AdminUpdateProductOptionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ option_id, ...payload }: AdminUpdateProductOptionReq) =>
      client.admin.products.updateOption(productId, option_id, payload),
    ...buildOptions(queryClient, adminProductKeys.detail(productId), options),
  })
}

/**
 * This hook deletes a product option. If there are product variants that use this product option,
 * they must be deleted before deleting the product option.
 *
 * @typeParamDefinition string - The ID of the product option to delete.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteProductOption } from "medusa-react"
 *
 * type Props = {
 *   productId: string
 *   optionId: string
 * }
 *
 * const ProductOption = ({
 *   productId,
 *   optionId
 * }: Props) => {
 *   const deleteOption = useAdminDeleteProductOption(
 *     productId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteOption.mutate(optionId, {
 *       onSuccess: ({ option_id, object, deleted, product }) => {
 *         console.log(product.options)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ProductOption
 *
 * @customNamespace Hooks.Admin.Products
 * @category Mutations
 */
export const useAdminDeleteProductOption = (
  /**
   * The product's ID.
   */
  productId: string,
  options?: UseMutationOptions<
    Response<AdminProductsDeleteOptionRes>,
    Error,
    string
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (optionId: string) =>
      client.admin.products.deleteOption(productId, optionId),
    ...buildOptions(queryClient, adminProductKeys.detail(productId), options),
  })
}
