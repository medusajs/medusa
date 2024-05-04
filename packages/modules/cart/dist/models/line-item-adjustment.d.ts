import AdjustmentLine from "./adjustment-line";
import LineItem from "./line-item";
export default class LineItemAdjustment extends AdjustmentLine {
    item: LineItem;
    item_id: string;
    promotion_id: string | null;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
