import React from "react"
import { useAdminRegion } from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const { region, isLoading } = useAdminRegion(
    regionId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {region && <span>{region.name}</span>}
    </div>
  )
}

export default Region
