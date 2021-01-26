import { EntityRepository, Repository } from "typeorm"
import { PaymentProvider } from "../models/payment-provider"

@EntityRepository(PaymentProvider)
export class PaymentProviderRepository extends Repository<PaymentProvider> {}
