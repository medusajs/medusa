import Spacer from "../../../components/atoms/spacer"
import BodyCard from "../../../components/organisms/body-card"
import ReservationsTable from "../../../components/templates/reservations-table"
import InventoryPageTableHeader from "../header"

const Reservations = () => {
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          customHeader={<InventoryPageTableHeader activeView="reservations" />}
          className="h-fit"
        >
          <ReservationsTable />
        </BodyCard>
        <Spacer />
      </div>
    </div>
  )
}

export default Reservations
