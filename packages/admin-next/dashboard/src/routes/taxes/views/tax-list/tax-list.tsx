import { useAdminRegions } from "medusa-react"
import { Link } from "react-router-dom"

export const TaxList = () => {
  const { regions, isLoading, isError, error } = useAdminRegions()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !regions) {
    return <div>Error</div>
  }

  return (
    <div>
      {regions.map((region) => {
        return (
          <div key={region.id}>
            <Link to={`/settings/taxes/${region.id}`}>{region.name}</Link>
          </div>
        )
      })}
    </div>
  )
}
