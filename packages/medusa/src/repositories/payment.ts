import { EntityRepository, Repository } from "typeorm"
import { Payment } from "../models/cart"

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {}
