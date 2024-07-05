import React from "react"
import { useRegion } from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({ regionId }: Props) => {
  const { region, isLoading } = useRegion(
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
