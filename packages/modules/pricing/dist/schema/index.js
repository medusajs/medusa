"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
exports.schema = `
type PriceSet {
  id: String!
  money_amounts: [MoneyAmount]
}

type MoneyAmount {
  id: String!
  currency_code: String
  amount: Float
  min_quantity: Float
  max_quantity: Float
}
`;
exports.default = exports.schema;
