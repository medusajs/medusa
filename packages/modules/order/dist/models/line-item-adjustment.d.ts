import AdjustmentLine from "./adjustment-line";
import LineItem from "./line-item";
export default class LineItemAdjustment extends AdjustmentLine {
    item: LineItem;
    item_id: string;
    onCreate(): void;
    onInit(): void;
}
