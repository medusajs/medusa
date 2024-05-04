"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsetForUpdate = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const unsetForUpdate = async (data, customerService, field) => {
    if (!data.update[field]) {
        return new workflows_sdk_1.StepResponse(void 0);
    }
    const affectedCustomers = await customerService.listAddresses(data.selector, {
        select: ["id", "customer_id"],
    });
    const customerIds = affectedCustomers.map((address) => address.customer_id);
    const customerDefaultAddresses = await customerService.listAddresses({
        customer_id: customerIds,
        [field]: true,
    });
    await customerService.updateAddresses({ customer_id: customerIds, [field]: true }, { [field]: false });
    return new workflows_sdk_1.StepResponse(void 0, customerDefaultAddresses.map((address) => address.id));
};
exports.unsetForUpdate = unsetForUpdate;
