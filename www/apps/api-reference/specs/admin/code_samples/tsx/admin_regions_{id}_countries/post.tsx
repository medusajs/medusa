import React from "react"
import { useAdminRegionAddCountry } from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const addCountry = useAdminRegionAddCountry(regionId)
  // ...

  const handleAddCountry = (
    countryCode: string
  ) => {
    addCountry.mutate({
      country_code: countryCode
    }, {
      onSuccess: ({ region }) => {
        console.log(region.countries)
      }
    })
  }

  // ...
}

export default Region
