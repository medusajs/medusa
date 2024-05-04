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
const utils_1 = require("@medusajs/utils");
const find_medusa_context_1 = require("./find-medusa-context");
async function default_1(moduleKeyName, baseUrl, serverOptions, logger) {
    let grpc;
    let protoLoader;
    try {
        grpc = await Promise.resolve().then(() => __importStar(require("@grpc/grpc-js")));
        protoLoader = await Promise.resolve().then(() => __importStar(require("@grpc/proto-loader")));
    }
    catch (err) {
        throw new Error("@grpc/grpc-js and @grpc/proto-loader are not installed. Please install them to serve MedusaApp as a web gRPC server.");
    }
    const PROTO_PATH = __dirname + "/../../../utils/servers/medusa-app.proto";
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    const medusaAppService = protoDescriptor.medusaAppService;
    const client = new medusaAppService.MedusaAppService(baseUrl, grpc.credentials.createInsecure());
    return new Proxy({}, {
        get(target, methodName) {
            if (["then", "catch", "finally"].includes(methodName)) {
                return target;
            }
            else if (methodName in target) {
                return target[methodName];
            }
            return async (...args) => {
                const request = {
                    module: moduleKeyName,
                    method: methodName,
                    args: JSON.stringify(args),
                };
                const metadata = new grpc.Metadata();
                const medusaContext = (0, find_medusa_context_1.findMedusaContext)(args);
                if (medusaContext) {
                    metadata.add("request-id", medusaContext.requestId);
                }
                return new Promise((resolve, reject) => {
                    client.Call(request, metadata, (error, response) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        try {
                            const resp = response.result;
                            const result = (0, utils_1.isString)(resp) ? JSON.parse(resp) : resp;
                            resolve(result);
                        }
                        catch (parseError) {
                            reject(parseError);
                        }
                    });
                });
            };
        },
    });
}
exports.default = default_1;
//# sourceMappingURL=grpc.js.map