import React from "react"
import { useAdminRegionRemoveCountry } from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const removeCountry = useAdminRegionRemoveCountry(regionId)
  // ...

  const handleRemoveCountry = (
    countryCode: string
  ) => {
    removeCountry.mutate(countryCode, {
      onSuccess: ({ region }) => {
        console.log(region.countries)
      }
    })
  }

  // ...
}

export default Region
