import { FlagSettings } from "../../types/feature-flags"

const ReservationsFeatureFlag: FlagSettings = {
  key: "reservations",
  default_val: false,
  env_key: "MEDUSA_FF_RESERVATIONS",
  description: "[WIP] Enable the reservations feature from the Inventory Module",
}

export default ReservationsFeatureFlag
