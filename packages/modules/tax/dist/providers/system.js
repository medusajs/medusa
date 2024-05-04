"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemTaxService {
    getIdentifier() {
        return SystemTaxService.identifier;
    }
    async getTaxLines(itemLines, shippingLines, _) {
        let taxLines = itemLines.flatMap((l) => {
            return l.rates.map((r) => ({
                rate_id: r.id,
                rate: r.rate || 0,
                name: r.name,
                code: r.code,
                line_item_id: l.line_item.id,
                provider_id: this.getIdentifier(),
            }));
        });
        taxLines = taxLines.concat(shippingLines.flatMap((l) => {
            return l.rates.map((r) => ({
                rate_id: r.id,
                rate: r.rate || 0,
                name: r.name,
                code: r.code,
                shipping_line_id: l.shipping_line.id,
                provider_id: this.getIdentifier(),
            }));
        }));
        return taxLines;
    }
}
SystemTaxService.identifier = "system";
exports.default = SystemTaxService;
