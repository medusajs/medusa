import { useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import EditRegion from "./edit"
import RegionOverview from "./region-overview"

const Regions = () => {
  const params = useParams()
  const regId: string | undefined = params["*"]

  return (
    <div className="flex flex-col gap-y-xsmall h-full">
      <BackButton label="Back to Settings" path="/a/settings" />
      <div className="grid grid-cols-1 medium:grid-cols-3 gap-xsmall pb-xlarge">
        <div className="w-full h-full">
          <RegionOverview id={regId} />
        </div>
        <div className="col-span-2">
          <EditRegion id={regId} />
        </div>
      </div>
    </div>
  )
}

export default Regions
