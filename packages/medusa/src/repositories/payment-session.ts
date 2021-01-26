import { EntityRepository, Repository } from "typeorm"
import { PaymentSession } from "../models/payment-session"

@EntityRepository(PaymentSession)
export class PaymentSessionRepository extends Repository<PaymentSession> {}
