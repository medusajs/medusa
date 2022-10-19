import { EntityRepository, Repository } from "typeorm"
import { Payment } from "../models/payment"

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {}
