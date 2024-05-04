import React from "react"
import { useAdminRegions } from "medusa-react"

const Regions = () => {
  const { regions, isLoading } = useAdminRegions()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {regions && !regions.length && <span>No Regions</span>}
      {regions && regions.length > 0 && (
        <ul>
          {regions.map((region) => (
            <li key={region.id}>{region.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Regions
