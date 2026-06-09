import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { ShippingOptionTypeListTable } from "./components/shipping-option-type-list-table"

export const ShippingOptionTypeList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("shipping_option_type.list.after"),
        before: getWidgets("shipping_option_type.list.before"),
      }}
      showRequiredPermissions
    >
      <ShippingOptionTypeListTable />
    </SingleColumnPage>
  )
}
