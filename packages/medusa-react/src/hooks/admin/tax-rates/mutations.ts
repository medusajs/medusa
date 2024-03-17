import {
  AdminDeleteTaxRatesTaxRateProductsReq,
  AdminDeleteTaxRatesTaxRateProductTypesReq,
  AdminDeleteTaxRatesTaxRateShippingOptionsReq,
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateProductsReq,
  AdminPostTaxRatesTaxRateProductTypesReq,
  AdminPostTaxRatesTaxRateReq,
  AdminPostTaxRatesTaxRateShippingOptionsReq,
  AdminTaxRatesDeleteRes,
  AdminTaxRatesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminTaxRateKeys } from "./queries"

/**
 * This hook creates a tax rate.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateTaxRate } from "medusa-react"
 *
 * type Props = {
 *   regionId: string
 * }
 *
 * const CreateTaxRate = ({ regionId }: Props) => {
 *   const createTaxRate = useAdminCreateTaxRate()
 *   // ...
 *
 *   const handleCreate = (
 *     code: string,
 *     name: string,
 *     rate: number
 *   ) => {
 *     createTaxRate.mutate({
 *       code,
 *       name,
 *       region_id: regionId,
 *       rate,
 *     }, {
 *       onSuccess: ({ tax_rate }) => {
 *         console.log(tax_rate.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateTaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminCreateTaxRate = (
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostTaxRatesReq) =>
      client.admin.taxRates.create(payload),
    ...buildOptions(queryClient, adminTaxRateKeys.lists(), options),
  })
}

/**
 * This hook updates a tax rate's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateTaxRate } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const updateTaxRate = useAdminUpdateTaxRate(taxRateId)
 *   // ...
 *
 *   const handleUpdate = (
 *     name: string
 *   ) => {
 *     updateTaxRate.mutate({
 *       name
 *     }, {
 *       onSuccess: ({ tax_rate }) => {
 *         console.log(tax_rate.name)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default TaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminUpdateTaxRate = (
  /**
   * The tax rate's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesTaxRateReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostTaxRatesTaxRateReq) =>
      client.admin.taxRates.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a tax rate. Resources associated with the tax rate, such as products or product types, are not deleted.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteTaxRate } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const deleteTaxRate = useAdminDeleteTaxRate(taxRateId)
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteTaxRate.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default TaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminDeleteTaxRate = (
  /**
   * The tax rate's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminTaxRatesDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.taxRates.delete(id),
    ...buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook adds products to a tax rate.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateProductTaxRates } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const addProduct = useAdminCreateProductTaxRates(taxRateId)
 *   // ...
 *
 *   const handleAddProduct = (productIds: string[]) => {
 *     addProduct.mutate({
 *       products: productIds,
 *     }, {
 *       onSuccess: ({ tax_rate }) => {
 *         console.log(tax_rate.products)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default TaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminCreateProductTaxRates = (
  /**
   * The tax rate's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesTaxRateProductsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostTaxRatesTaxRateProductsReq) =>
      client.admin.taxRates.addProducts(id, payload),
    ...buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook removes products from a tax rate. This only removes the association between the products and the tax rate. It does not delete the products.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteProductTaxRates } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const removeProduct = useAdminDeleteProductTaxRates(taxRateId)
 *   // ...
 *
 *   const handleRemoveProduct = (productIds: string[]) => {
 *     removeProduct.mutate({
 *       products: productIds,
 *     }, {
 *       onSuccess: ({ tax_rate }) => {
 *         console.log(tax_rate.products)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default TaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminDeleteProductTaxRates = (
  /**
   * The tax rate's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminDeleteTaxRatesTaxRateProductsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDeleteTaxRatesTaxRateProductsReq) =>
      client.admin.taxRates.removeProducts(id, payload),
    ...buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook adds product types to a tax rate.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminCreateProductTypeTaxRates,
 * } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const addProductTypes = useAdminCreateProductTypeTaxRates(
 *     taxRateId
 *   )
 *   // ...
 *
 *   const handleAddProductTypes = (productTypeIds: string[]) => {
 *     addProductTypes.mutate({
 *       product_types: productTypeIds,
 *     }, {
 *       onSuccess: ({ tax_rate }) => {
 *         console.log(tax_rate.product_types)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default TaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminCreateProductTypeTaxRates = (
  /**
   * The tax rate's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesTaxRateProductTypesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostTaxRatesTaxRateProductTypesReq) =>
      client.admin.taxRates.addProductTypes(id, payload),
    ...buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook removes product types from a tax rate. This only removes the association between the
 * product types and the tax rate. It does not delete the product types.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminDeleteProductTypeTaxRates,
 * } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const removeProductTypes = useAdminDeleteProductTypeTaxRates(
 *     taxRateId
 *   )
 *   // ...
 *
 *   const handleRemoveProductTypes = (
 *     productTypeIds: string[]
 *   ) => {
 *     removeProductTypes.mutate({
 *       product_types: productTypeIds,
 *     }, {
 *       onSuccess: ({ tax_rate }) => {
 *         console.log(tax_rate.product_types)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default TaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminDeleteProductTypeTaxRates = (
  /**
   * The tax rate's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminDeleteTaxRatesTaxRateProductTypesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDeleteTaxRatesTaxRateProductTypesReq) =>
      client.admin.taxRates.removeProductTypes(id, payload),
    ...buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook adds shipping options to a tax rate.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateShippingTaxRates } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const addShippingOption = useAdminCreateShippingTaxRates(
 *     taxRateId
 *   )
 *   // ...
 *
 *   const handleAddShippingOptions = (
 *     shippingOptionIds: string[]
 *   ) => {
 *     addShippingOption.mutate({
 *       shipping_options: shippingOptionIds,
 *     }, {
 *       onSuccess: ({ tax_rate }) => {
 *         console.log(tax_rate.shipping_options)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default TaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminCreateShippingTaxRates = (
  /**
   * The tax rate's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminPostTaxRatesTaxRateShippingOptionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostTaxRatesTaxRateShippingOptionsReq) =>
      client.admin.taxRates.addShippingOptions(id, payload),
    ...buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook removes shipping options from a tax rate. This only removes the association between
 * the shipping options and the tax rate. It does not delete the shipping options.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteShippingTaxRates } from "medusa-react"
 *
 * type Props = {
 *   taxRateId: string
 * }
 *
 * const TaxRate = ({ taxRateId }: Props) => {
 *   const removeShippingOptions = useAdminDeleteShippingTaxRates(
 *     taxRateId
 *   )
 *   // ...
 *
 *   const handleRemoveShippingOptions = (
 *     shippingOptionIds: string[]
 *   ) => {
 *     removeShippingOptions.mutate({
 *       shipping_options: shippingOptionIds,
 *     }, {
 *       onSuccess: ({ tax_rate }) => {
 *         console.log(tax_rate.shipping_options)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default TaxRate
 *
 * @customNamespace Hooks.Admin.Tax Rates
 * @category Mutations
 */
export const useAdminDeleteShippingTaxRates = (
  /**
   * The tax rate's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminTaxRatesRes>,
    Error,
    AdminDeleteTaxRatesTaxRateShippingOptionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDeleteTaxRatesTaxRateShippingOptionsReq) =>
      client.admin.taxRates.removeShippingOptions(id, payload),
    ...buildOptions(
      queryClient,
      [adminTaxRateKeys.lists(), adminTaxRateKeys.detail(id)],
      options
    ),
  })
}
