import { useAdminStockLocations } from "medusa-react"
import Fade from "../../../components/atoms/fade-wrapper"
import Spinner from "../../../components/atoms/spinner"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import useToggleState from "../../../hooks/use-toggle-state"
import InventoryPageTableHeader from "../header"
import NewLocation from "./new"
import LocationCard from "./components/location-card"

const Locations = () => {
  const {
    state: createLocationState,
    close: closeLocationCreate,
    open: openLocationCreate,
  } = useToggleState()

  const Actions = (
    <Button variant="secondary" size="small" onClick={openLocationCreate}>
      <PlusIcon size={20} />
      Add location
    </Button>
  )

  const { stock_locations, isLoading } = useAdminStockLocations({
    expand: "address,sales_channels",
  })

  return (
    <>
      <div className="flex flex-col h-full grow">
        <div className="flex flex-col w-full grow">
          <BodyCard
            customHeader={<InventoryPageTableHeader activeView="locations" />}
            className="min-h-[85px] h-[85px]"
            customActionable={Actions}
          />
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Spinner variant="secondary" />
            </div>
          ) : (
            <div>
              {stock_locations?.map((stockLocation) => (
                <LocationCard location={stockLocation} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Fade isVisible={createLocationState} isFullScreen={true}>
        <NewLocation onClose={closeLocationCreate} />
      </Fade>
    </>
  )
}

export default Locations
