import React, { FC } from "react"
import { useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import { useBasePath } from "../../../utils/routePathing"
import EditRegion from "./edit"
import RegionOverview from "./region-overview"

const Regions = () => {
  const basePath = useBasePath()
  const { id } = useParams()

  return (
    <div className="flex flex-col gap-y-xsmall h-full">
      <BackButton label="Back to Settings" path={`${basePath}/settings`} />
      <div className="grid grid-cols-1 medium:grid-cols-3 gap-xsmall pb-xlarge">
        <div className="w-full h-full">
          <RegionOverview id={id} />
        </div>
        <div className="col-span-2">
          <EditRegion id={id} />
        </div>
      </div>
    </div>
  )
}

export default Regions
