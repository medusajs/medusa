import React from "react"
import { useAdminCreateTaxRate } from "medusa-react"

type Props = {
  regionId: string
}

const CreateTaxRate = ({ regionId }: Props) => {
  const createTaxRate = useAdminCreateTaxRate()
  // ...

  const handleCreate = (
    code: string,
    name: string,
    rate: number
  ) => {
    createTaxRate.mutate({
      code,
      name,
      region_id: regionId,
      rate,
    }, {
      onSuccess: ({ tax_rate }) => {
        console.log(tax_rate.id)
      }
    })
  }

  // ...
}

export default CreateTaxRate
