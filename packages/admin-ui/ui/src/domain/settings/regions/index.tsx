import { useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import EditRegion from "./edit"
import RegionOverview from "./region-overview"

const Regions = () => {
  const params = useParams()
  const regId: string | undefined = params["*"]

  return (
    <div className="gap-y-xsmall flex h-full flex-col">
      <BackButton label="Back to settings" path="/a/settings" />
      <div className="medium:grid-cols-3 gap-xsmall pb-xlarge grid grid-cols-1">
        <div className="h-full w-full">
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
