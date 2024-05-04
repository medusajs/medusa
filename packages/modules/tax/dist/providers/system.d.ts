import { ITaxProvider, TaxTypes } from "@medusajs/types";
export default class SystemTaxService implements ITaxProvider {
    static identifier: string;
    getIdentifier(): string;
    getTaxLines(itemLines: TaxTypes.ItemTaxCalculationLine[], shippingLines: TaxTypes.ShippingTaxCalculationLine[], _: TaxTypes.TaxCalculationContext): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]>;
}
