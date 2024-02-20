import { AdminGetShippingOptionsParams } from "@medusajs/medusa"

type UseShippingOptionTableQueryProps = {
  pageSize?: number
  regionId: string
  isReturn?: boolean
}

export const useShippingOptionTableQuery = ({
  regionId,
  pageSize = 10,
  isReturn = false,
}: UseShippingOptionTableQueryProps) => {
  const searchParams: AdminGetShippingOptionsParams = {
    region_id: regionId,
    is_return: isReturn,
  }
}
