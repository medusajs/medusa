"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateCustomer = void 0;
const utils_1 = require("@medusajs/utils");
var Aliases;
(function (Aliases) {
    Aliases["Customer"] = "customer";
})(Aliases || (Aliases = {}));
async function findOrCreateCustomer({ container, context, data, }) {
    const { manager } = context;
    const customerService = container.resolve("customerService");
    const customerDataDTO = {};
    const customerId = data[Aliases.Customer].customer_id;
    const customerServiceTx = customerService.withTransaction(manager);
    if (customerId) {
        const customer = await customerServiceTx
            .retrieve(customerId)
            .catch(() => undefined);
        customerDataDTO.customer = customer;
        customerDataDTO.customer_id = customer?.id;
        customerDataDTO.email = customer?.email;
    }
    const customerEmail = data[Aliases.Customer].email;
    if (customerEmail) {
        const validatedEmail = (0, utils_1.validateEmail)(customerEmail);
        let customer = await customerServiceTx
            .retrieveUnregisteredByEmail(validatedEmail)
            .catch(() => undefined);
        if (!customer) {
            customer = await customerServiceTx.create({ email: validatedEmail });
        }
        customerDataDTO.customer = customer;
        customerDataDTO.customer_id = customer.id;
        customerDataDTO.email = customer.email;
    }
    return customerDataDTO;
}
exports.findOrCreateCustomer = findOrCreateCustomer;
findOrCreateCustomer.aliases = Aliases;
