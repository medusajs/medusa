import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { RouteFocusModal } from "../../../../../components/route-modal"

type TaxRegionCreateFormProps = {
  parentId?: string
}

const TaxRegionCreateSchema = z.object({
  name: z.string(),
  code: z.string().optional(),
  rate: z.number(),
  is_combinable: z.boolean().optional(),
  country_code: z.string().optional(),
  province_code: z.string().optional(),
})

export const TaxRegionCreateForm = ({ parentId }: TaxRegionCreateFormProps) => {
  const form = useForm<z.infer<typeof TaxRegionCreateSchema>>({
    defaultValues: {
      name: "",
      rate: "",
      code: "",
      country_code: "",
      province_code: "",
      is_combinable: false,
    },
    resolver: zodResolver(TaxRegionCreateSchema),
  })

  return <RouteFocusModal.Form form={form}></RouteFocusModal.Form>
}
