"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeCartWorkflow = exports.completeCartWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const common_1 = require("../../../common");
const steps_1 = require("../steps");
const update_tax_lines_1 = require("../steps/update-tax-lines");
const fields_1 = require("../utils/fields");
/*
  - [] Create Tax Lines
  - [] Authorize Payment
    - fail:
      - [] Delete Tax lines
  - [] Reserve Item from inventory (if enabled)
    - fail:
      - [] Delete reservations
      - [] Cancel Payment
  - [] Create order
*/
exports.completeCartWorkflowId = "complete-cart";
exports.completeCartWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.completeCartWorkflowId, (input) => {
    const cart = (0, common_1.useRemoteQueryStep)({
        entry_point: "cart",
        fields: fields_1.completeCartFields,
        variables: { id: input.id },
        list: false,
    });
    (0, update_tax_lines_1.updateTaxLinesStep)({ cart_or_cart_id: cart, force_tax_calculation: true });
    const finalCart = (0, common_1.useRemoteQueryStep)({
        entry_point: "cart",
        fields: fields_1.completeCartFields,
        variables: { id: input.id },
        list: false,
    }).config({ name: "final-cart" });
    return (0, steps_1.createOrderFromCartStep)({ cart: finalCart });
});
