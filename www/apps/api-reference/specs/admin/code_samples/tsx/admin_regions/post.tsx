import React from "react"
import { useAdminCreateRegion } from "medusa-react"

type CreateData = {
  name: string
  currency_code: string
  tax_rate: number
  payment_providers: string[]
  fulfillment_providers: string[]
  countries: string[]
}

const CreateRegion = () => {
  const createRegion = useAdminCreateRegion()
  // ...

  const handleCreate = (regionData: CreateData) => {
    createRegion.mutate(regionData, {
      onSuccess: ({ region }) => {
        console.log(region.id)
      }
    })
  }

  // ...
}

export default CreateRegion
