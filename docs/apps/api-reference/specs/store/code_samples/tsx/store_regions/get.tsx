import React from "react"
import { useRegions } from "medusa-react"

const Regions = () => {
  const { regions, isLoading } = useRegions()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {regions?.length && (
        <ul>
          {regions.map((region) => (
            <li key={region.id}>
              {region.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Regions
