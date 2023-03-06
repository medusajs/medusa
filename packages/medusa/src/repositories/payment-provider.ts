import { dataSource } from "../loaders/database"
import { PaymentProvider } from "../models"

export const PaymentProviderRepository =
  dataSource.getRepository(PaymentProvider)
export default PaymentProviderRepository
