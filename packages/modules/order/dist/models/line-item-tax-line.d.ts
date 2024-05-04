import LineItem from "./line-item";
import TaxLine from "./tax-line";
export default class LineItemTaxLine extends TaxLine {
    item: LineItem;
    item_id: string;
    onCreate(): void;
    onInit(): void;
}
