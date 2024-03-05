import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { RouteFocusModal } from "../../../../../components/route-modal"

const CreateTaxRateSchema = z.object({
  name: z.string().min(1),
})

export const CreateTaxRateForm = () => {
  const form = useForm<z.infer<typeof CreateTaxRateSchema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(CreateTaxRateSchema),
  })

  return <RouteFocusModal.Form form={form}></RouteFocusModal.Form>
}
