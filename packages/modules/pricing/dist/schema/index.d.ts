export declare const schema = "\ntype PriceSet {\n  id: String!\n  money_amounts: [MoneyAmount]\n}\n\ntype MoneyAmount {\n  id: String!\n  currency_code: String\n  amount: Float\n  min_quantity: Float\n  max_quantity: Float\n}\n";
export default schema;
