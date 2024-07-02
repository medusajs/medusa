import { RouteFocusModal } from "../../../components/modals"
import { useSalesChannel } from "../../../hooks/api/sales-channels"
import { useStore } from "../../../hooks/api/store"
import { ProductCreateForm } from "./components/product-create-form/product-create-form"

export const ProductCreate = () => {
  const { store } = useStore({
    fields: "default_sales_channel",
  })

  const { sales_channel, isPending } = useSalesChannel(
    store?.default_sales_channel_id,
    {
      enabled: !!store,
    }
  )

  const canDisplayForm = store && !isPending

  return (
    <RouteFocusModal>
      {canDisplayForm && <ProductCreateForm defaultChannel={sales_channel} />}
    </RouteFocusModal>
  )
}
