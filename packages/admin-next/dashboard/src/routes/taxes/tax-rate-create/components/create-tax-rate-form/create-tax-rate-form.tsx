import { zodResolver } from "@hookform/resolvers/zod"
import { useAdminCreateTaxRate } from "medusa-react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"

import { RouteFocusModal } from "../../../../../components/route-modal"

const CreateTaxRateSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
})

export const CreateTaxRateForm = () => {
  const { id } = useParams()

  const form = useForm<z.infer<typeof CreateTaxRateSchema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(CreateTaxRateSchema),
  })

  const { mutateAsync } = useAdminCreateTaxRate()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync({
      region_id: id!,
      ...data,
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit}></form>
    </RouteFocusModal.Form>
  )
}
