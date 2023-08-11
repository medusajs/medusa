import { PaymentProvider } from "../models"
import { dataSource } from "../loaders/database"

export const PaymentProviderRepository =
  dataSource.getRepository(PaymentProvider)
export default PaymentProviderRepository
