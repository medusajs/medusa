import { ProductStatus } from "@medusajs/medusa"
import {
  ProductTagReq,
  ProductTypeReq,
} from "@medusajs/medusa/dist/types/product"
import {
  adminCollectionKeys,
  adminProductKeys,
  adminProductTagKeys,
} from "medusa-react"
import { useMutation, useQueryClient } from "react-query"
import medusaRequest from "../../../services/request"
import { buildOptions } from "../../utils/buildOptions"

export interface AdminPostBulkProductUpdateParams {
  ids: string[]
  profile_id?: string
  discountable?: boolean
  type?: ProductTypeReq
  collection_id?: string
  add_tags?: ProductTagReq[]
  remove_tags?: ProductTagReq[]
  status?: ProductStatus
}

export const useAdminBulkProductUpdate = () => {
  const path = `/admin/products/bulk`

  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostBulkProductUpdateParams) =>
      medusaRequest<{ message: string }>("PUT", path, payload),
    buildOptions(queryClient, [
      adminProductKeys.all,
      adminProductTagKeys.all,
      adminCollectionKeys.all,
    ])
  )
}
