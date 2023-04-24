import { useMemo } from "react"
import { useAdminShippingOptions } from "medusa-react"

export const useAdminVendorShippingOptions = (id?: string) => {
  const {
    shipping_options: shippingOptions,
    ...rest
  } = useAdminShippingOptions()

  const vendorShippingOptions = useMemo(
    () =>
      shippingOptions?.filter(({ profile }) =>
        id ? profile?.vendor_id === id : !profile?.vendor_id
      ),
    [shippingOptions, id]
  )

  return { shipping_options: vendorShippingOptions, ...rest }
}
