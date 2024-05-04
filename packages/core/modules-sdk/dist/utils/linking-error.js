"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkingErrorMessage = void 0;
const typeToMethod = new Map([
    [`dismiss`, `dismiss`],
    [`link`, `create`],
]);
/**
 *
 * Example: Module to dismiss salesChannel and apiKey by keys sales_channel_id and api_key_id was not found. Ensure the link exists, keys are correct, and the link is passed in the correct order to method 'remoteLink.dismiss'
 */
const linkingErrorMessage = (input) => {
    const { moduleA, moduleB, moduleAKey, moduleBKey, type } = input;
    return `Module to type ${moduleA} and ${moduleB} by keys ${moduleAKey} and ${moduleBKey} was not found. Ensure the link exists, keys are correct, and link is passed in the correct order to method 'remoteLink.${typeToMethod.get(type)}'.
`;
};
exports.linkingErrorMessage = linkingErrorMessage;
//# sourceMappingURL=linking-error.js.map