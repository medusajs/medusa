"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsetForCreate = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const unsetForCreate = async (data, customerService, field) => {
    const customerIds = data.reduce((acc, curr) => {
        if (curr[field]) {
            acc.push(curr.customer_id);
        }
        return acc;
    }, []);
    const customerDefaultAddresses = await customerService.listAddresses({
        customer_id: customerIds,
        [field]: true,
    });
    await customerService.updateAddresses({ customer_id: customerIds, [field]: true }, { [field]: false });
    return new workflows_sdk_1.StepResponse(void 0, customerDefaultAddresses.map((address) => address.id));
};
exports.unsetForCreate = unsetForCreate;
