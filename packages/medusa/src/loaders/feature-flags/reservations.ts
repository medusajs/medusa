import { FlagSettings } from "../../types/feature-flags"

const ReservationsFeatureFlag: FlagSettings = {
  key: "reservations",
  default_val: false,
  env_key: "MEDUSA_FF_RESERVATIONS",
  description:
    "Enable Medusa to collect data on usage, errors and performance for the purpose of improving the product",
}

export default ReservationsFeatureFlag
