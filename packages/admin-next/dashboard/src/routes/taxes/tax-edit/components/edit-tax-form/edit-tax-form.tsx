import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { RouteFocusModal } from "../../../../../components/route-modal"

const EditTaxRateSchema = z.object({
  name: z.string().min(1),
})

export const EditTaxRateForm = () => {
  const form = useForm<z.infer<typeof EditTaxRateSchema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(EditTaxRateSchema),
  })

  return <RouteFocusModal.Form form={form}></RouteFocusModal.Form>
}
