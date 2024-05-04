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
const definitions_1 = require("../../definitions");
const find_medusa_context_1 = require("../../loaders/utils/clients/find-medusa-context");
function default_1(container, loadedModules, remoteQuery) {
    return async (port, options) => {
        let grpc;
        let protoLoader;
        try {
            grpc = await Promise.resolve().then(() => __importStar(require("@grpc/grpc-js")));
            protoLoader = await Promise.resolve().then(() => __importStar(require("@grpc/proto-loader")));
        }
        catch (err) {
            throw new Error("@grpc/grpc-js and @grpc/proto-loader are not installed. Please install them to serve MedusaApp as a web gRPC server.");
        }
        const PROTO_PATH = __dirname + "/medusa-app.proto";
        const packageDefinition = protoLoader.loadSync(PROTO_PATH);
        const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
        async function handleCall(call, callback) {
            const { module, method, args } = call.request;
            const modName = module ?? "";
            const resolutionName = definitions_1.ModuleRegistrationName[modName.toUpperCase()] ??
                Object.values(loadedModules[modName])[0]?.__definition?.registrationName;
            const resolvedModule = container.resolve(resolutionName, {
                allowUnregistered: true,
            });
            if (!resolvedModule) {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    message: `Module ${modName} not found.`,
                });
            }
            if (method === "__joinerConfig" || method == "__definition") {
                const result = JSON.stringify(resolvedModule[method]);
                return callback(null, { result });
            }
            else if (typeof resolvedModule[method] !== "function") {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    message: `Method "${method}" not found in "${modName}"`,
                });
            }
            try {
                const args_ = JSON.parse(args);
                const requestId = call.metadata.get("request-id")?.[0];
                if (requestId) {
                    const medusaContext = (0, find_medusa_context_1.findMedusaContext)(args_);
                    if (medusaContext) {
                        medusaContext.requestId ?? (medusaContext.requestId = requestId);
                    }
                }
                const result = await resolvedModule[method].apply(resolvedModule, args_);
                return callback(null, {
                    result: JSON.stringify(result),
                });
            }
            catch (err) {
                callback({
                    code: grpc.status.UNKNOWN,
                    message: err.message,
                });
            }
        }
        async function handleQuery(call, callback) {
            const { args } = call.request;
            try {
                const input = JSON.parse(args);
                let query;
                let variables = {};
                if ((0, utils_1.isString)(input.query)) {
                    query = input.query;
                    variables = input.variables ?? {};
                }
                else {
                    query = input;
                }
                try {
                    const result = await remoteQuery(query, variables);
                    return callback(null, { result });
                }
                catch (err) {
                    return callback({
                        code: grpc.status.UNKNOWN,
                        message: err.message,
                    });
                }
            }
            catch (error) {
                return callback({
                    code: grpc.status.UNKNOWN,
                    message: error.message,
                });
            }
        }
        const medusaAppService = protoDescriptor.medusaAppService;
        const server = new grpc.Server();
        server.addService(medusaAppService.MedusaAppService.service, {
            Call: handleCall,
            Query: handleQuery,
        });
        return server.bindAsync("0.0.0.0:" + port, grpc.ServerCredentials.createInsecure(), () => {
            server.start();
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=grpc.js.map