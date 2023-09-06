"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSourceFromOperation = void 0;
const process_node_1 = require("./process-node");
function makeSourceFromOperation(gatsbyApi) {
    return async function sourceFromOperation(op) {
        const { reporter, actions } = gatsbyApi;
        reporter.info(`Initiating operation query ${op.name}`);
        const nodes = await op.execute();
        nodes.map((rawNode) => {
            const nodeArr = (0, process_node_1.processNode)(rawNode, op.name, gatsbyApi.createContentDigest);
            nodeArr.forEach((node) => {
                actions.createNode(node);
            });
        });
    };
}
exports.makeSourceFromOperation = makeSourceFromOperation;
//# sourceMappingURL=make-source-from-operation.js.map