"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processNode = void 0;
const capitalize_1 = require("./utils/capitalize");
const processNode = (node, fieldName, createContentDigest) => {
    var _a;
    const nodeId = node.id;
    const nodeContent = JSON.stringify(node);
    const nodeContentDigest = createContentDigest(nodeContent);
    let images = [];
    if (fieldName === "products") {
        if ((_a = node.images) === null || _a === void 0 ? void 0 : _a.length) {
            images = node.images.map((image) => {
                const nodeImageContentDigest = createContentDigest(image.id);
                const nodeImageContent = JSON.stringify(image);
                const imageData = Object.assign({}, image, {
                    id: image.id,
                    parent: nodeId,
                    children: [],
                    internal: {
                        type: "MedusaImages",
                        content: nodeImageContent,
                        contentDigest: nodeImageContentDigest,
                    },
                });
                return imageData;
            });
        }
        delete node.images;
    }
    const nodeData = Object.assign({}, node, {
        id: nodeId,
        parent: null,
        children: [],
        internal: {
            type: `Medusa${(0, capitalize_1.capitalize)(fieldName)}`,
            content: nodeContent,
            contentDigest: nodeContentDigest,
        },
    });
    return [nodeData, ...images];
};
exports.processNode = processNode;
//# sourceMappingURL=process-node.js.map