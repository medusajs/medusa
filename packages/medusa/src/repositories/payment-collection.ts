import { PaymentCollection } from "./../models/payment-collection"
import { EntityRepository, Repository } from "typeorm"

@EntityRepository(PaymentCollection)
// eslint-disable-next-line max-len
export class PaymentCollectionRepository extends Repository<PaymentCollection> {}
