"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperations = void 0;
const client_1 = require("./client");
function createOperations(options) {
    const client = (0, client_1.createClient)(options);
    function createOperation(name, queryString) {
        return {
            execute: () => client[name](queryString),
            name: name,
        };
    }
    return {
        createProductsOperation: createOperation("products"),
        createCollectionsOperation: createOperation("collections"),
        createRegionsOperation: createOperation("regions"),
        createOrdersOperation: createOperation("orders"),
        incrementalProductsOperation: (date) => createOperation("products", date),
        incrementalCollectionsOperation: (date) => createOperation("collections", date),
        incrementalRegionsOperation: (date) => createOperation("regions", date),
        incrementalOrdersOperation: (date) => createOperation("orders", date),
    };
}
exports.createOperations = createOperations;
//# sourceMappingURL=operations.js.map