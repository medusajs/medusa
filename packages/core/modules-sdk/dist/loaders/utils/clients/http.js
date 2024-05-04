"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_medusa_context_1 = require("./find-medusa-context");
const openedClients = new Map();
async function getHttpClient(baseUrl, serverOptions) {
    if (openedClients.has(baseUrl)) {
        return openedClients.get(baseUrl);
    }
    const { Client } = await Promise.resolve().then(() => __importStar(require("undici")));
    let keepAliveAgent;
    if (serverOptions?.keepAlive) {
        keepAliveAgent = {
            keepAliveTimeout: serverOptions.keepAliveTimeout ?? 1000 * 60 * 3, // 3 minutes
        };
    }
    const client = new Client(baseUrl, keepAliveAgent);
    openedClients.set(baseUrl, client);
    return client;
}
async function default_1(moduleKeyName, baseUrl, server, logger) {
    const client = await getHttpClient(baseUrl, server?.options);
    return new Proxy({}, {
        get(target, methodName) {
            if (["then", "catch", "finally"].includes(methodName)) {
                return target;
            }
            else if (methodName in target) {
                return target[methodName];
            }
            return async (...args) => {
                const path = `/modules/${moduleKeyName}/${methodName}`;
                try {
                    const medusaContext = (0, find_medusa_context_1.findMedusaContext)(args);
                    const sendHeaders = {
                        "content-type": "application/json",
                        "accept-encoding": "gzip, deflate, br",
                        connection: "keep-alive",
                    };
                    if (medusaContext) {
                        sendHeaders["x-request-id"] = medusaContext.requestId;
                    }
                    const { statusCode, body } = await client.request({
                        path,
                        method: "POST",
                        headers: sendHeaders,
                        body: JSON.stringify(args), // arguments as an array
                    });
                    let responseData = "";
                    for await (const data of body) {
                        responseData += data.toString();
                    }
                    if (statusCode < 200 || statusCode >= 300) {
                        throw new Error(responseData);
                    }
                    return JSON.parse(responseData);
                }
                catch (error) {
                    throw error;
                }
            };
        },
    });
}
exports.default = default_1;
//# sourceMappingURL=http.js.map