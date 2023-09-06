"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceUpdatedNodes = exports.sourceAllNodes = void 0;
const make_source_from_operation_1 = require("./make-source-from-operation");
const operations_1 = require("./operations");
const medusaNodeTypes = [
    "MedusaRegions",
    "MedusaProducts",
    "MedusaOrders",
    "MedusaCollections",
];
async function sourceAllNodes(gatsbyApi, pluginOptions) {
    const { createProductsOperation, createRegionsOperation, createOrdersOperation, createCollectionsOperation, } = (0, operations_1.createOperations)(pluginOptions);
    const operations = [
        createProductsOperation,
        createRegionsOperation,
        createCollectionsOperation,
    ];
    // if auth token is provided then source orders
    if (pluginOptions.apiKey) {
        operations.push(createOrdersOperation);
    }
    const sourceFromOperation = (0, make_source_from_operation_1.makeSourceFromOperation)(gatsbyApi);
    for (const op of operations) {
        await sourceFromOperation(op);
    }
}
exports.sourceAllNodes = sourceAllNodes;
async function sourceUpdatedNodes(gatsbyApi, pluginOptions, lastBuildTime) {
    const { incrementalProductsOperation, incrementalRegionsOperation, incrementalOrdersOperation, incrementalCollectionsOperation, } = (0, operations_1.createOperations)(pluginOptions);
    for (const nodeType of medusaNodeTypes) {
        gatsbyApi
            .getNodesByType(nodeType)
            .forEach((node) => gatsbyApi.actions.touchNode(node));
    }
    const operations = [
        incrementalProductsOperation(lastBuildTime),
        incrementalRegionsOperation(lastBuildTime),
        incrementalCollectionsOperation(lastBuildTime),
    ];
    if (pluginOptions.apiKey) {
        operations.push(incrementalOrdersOperation(lastBuildTime));
    }
    const sourceFromOperation = (0, make_source_from_operation_1.makeSourceFromOperation)(gatsbyApi);
    for (const op of operations) {
        await sourceFromOperation(op);
    }
}
exports.sourceUpdatedNodes = sourceUpdatedNodes;
//# sourceMappingURL=source-nodes.js.map