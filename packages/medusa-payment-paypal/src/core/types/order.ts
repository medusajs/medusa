import {
  Bancontact,
  Blik,
  Card,
  EPS,
  Ideal,
  MyBank,
  P24,
  Paypal,
  PurchaseUnit,
  Sofort,
  Token,
  Trustly,
} from "./common"

export interface CreateOrder {
  intent: "CAPTURE" | "AUTHORIZE"
  purchase_units: Array<PurchaseUnit>
  payment_source?: {
    bancontact?: Bancontact
    blik?: Blik
    card?: Card
    eps?: EPS
    ideal?: Ideal
    myBank?: MyBank
    p24?: P24
    paypal?: Paypal
    sofort?: Sofort
    token?: Token
    trustly?: Trustly
  }
}
