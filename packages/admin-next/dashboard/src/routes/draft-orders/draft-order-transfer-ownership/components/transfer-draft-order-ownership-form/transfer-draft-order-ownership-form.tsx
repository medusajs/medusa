import { zodResolver } from "@hookform/resolvers/zod"
import { DraftOrder } from "@medusajs/medusa"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { TransferOwnerShipForm } from "../../../../../components/forms/transfer-ownership-form"
import { RouteDrawer } from "../../../../../components/route-modal"

type TransferDraftOrderOwnershipFormProps = {
  draftOrder: DraftOrder
}

const TransferDraftOrderOwnershipSchema = z.object({
  customer_id: z.string().min(1),
})

export const TransferDraftOrderOwnershipForm = ({
  draftOrder,
}: TransferDraftOrderOwnershipFormProps) => {
  const form = useForm<z.infer<typeof TransferDraftOrderOwnershipSchema>>({
    defaultValues: {
      customer_id: "",
    },
    resolver: zodResolver(TransferDraftOrderOwnershipSchema),
  })

  return (
    <RouteDrawer.Form form={form}>
      <form>
        <RouteDrawer.Body>
          <TransferOwnerShipForm order={draftOrder} control={form.control} />
        </RouteDrawer.Body>
        <RouteDrawer.Footer></RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
