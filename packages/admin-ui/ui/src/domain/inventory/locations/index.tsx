import { useEffect } from "react"
import { useAdminStockLocations } from "medusa-react"
import { useSearchParams } from "react-router-dom"
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

  const [, setSearchParams] = useSearchParams()

  useEffect(() => {
    // If we get redirected here from the inventory tab, we have some hanging search params
    // clear them for cleanliness
    setSearchParams({})
  }, [setSearchParams])

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
      <div className="flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            customHeader={<InventoryPageTableHeader activeView="locations" />}
            className="h-[85px] min-h-[85px]"
            customActionable={Actions}
          />
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner variant="secondary" />
            </div>
          ) : (
            <div>
              {stock_locations?.map((stockLocation) => (
                <LocationCard key={stockLocation.id} location={stockLocation} />
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
