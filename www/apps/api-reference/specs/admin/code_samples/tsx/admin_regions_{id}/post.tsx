import React from "react"
import { useAdminUpdateRegion } from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const updateRegion = useAdminUpdateRegion(regionId)
  // ...

  const handleUpdate = (
    countries: string[]
  ) => {
    updateRegion.mutate({
      countries,
    }, {
      onSuccess: ({ region }) => {
        console.log(region.id)
      }
    })
  }

  // ...
}

export default Region
