import React from "react"
import { useAdminRegionFulfillmentOptions } from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const {
    fulfillment_options,
    isLoading
  } = useAdminRegionFulfillmentOptions(
    regionId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {fulfillment_options && !fulfillment_options.length && (
        <span>No Regions</span>
      )}
      {fulfillment_options &&
        fulfillment_options.length > 0 && (
        <ul>
          {fulfillment_options.map((option) => (
            <li key={option.provider_id}>
              {option.provider_id}
            </li>
          ))}
        </ul>
          )}
    </div>
  )
}

export default Region
