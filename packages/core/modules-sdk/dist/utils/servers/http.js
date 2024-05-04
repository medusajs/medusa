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
const definitions_1 = require("../../definitions");
const find_medusa_context_1 = require("../../loaders/utils/clients/find-medusa-context");
function default_1(container, loadedModules, remoteQuery) {
    return async (port, options) => {
        let serverDependency;
        let fastifyCompress;
        try {
            serverDependency = await Promise.resolve().then(() => __importStar(require("fastify")));
            fastifyCompress = await Promise.resolve().then(() => __importStar(require("@fastify/compress")));
        }
        catch (err) {
            throw new Error("Fastify or fastify-compress is not installed. Please install them to serve MedusaApp as a web server.");
        }
        const fastify = serverDependency.default({
            logger: true,
            keepAliveTimeout: 1000 * 60 * 2,
            connectionTimeout: 1000 * 60 * 1,
            ...(options ?? {}),
        });
        fastify.register(fastifyCompress);
        fastify.addHook("onSend", async (request, response) => {
            const requestId = request.headers["x-request-id"];
            if (requestId) {
                response.header("X-Request-Id", request.headers["x-request-id"]);
            }
        });
        fastify.post("/modules/:module/:method", async (request, response) => {
            const { module, method } = request.params;
            const args = request.body;
            const modName = module ?? "";
            const resolutionName = definitions_1.ModuleRegistrationName[modName.toUpperCase()] ??
                Object.values(loadedModules[modName])[0]?.__definition?.registrationName;
            const resolvedModule = container.resolve(resolutionName, {
                allowUnregistered: true,
            });
            if (!resolvedModule) {
                return response.status(500).send(`Module ${modName} not found.`);
            }
            if (method === "__joinerConfig" || method == "__definition") {
                return resolvedModule[method];
            }
            else if (typeof resolvedModule[method] !== "function") {
                return response
                    .status(500)
                    .send(`Method "${method}" not found in "${modName}"`);
            }
            try {
                const requestId = request.headers["x-request-id"];
                if (requestId) {
                    const medusaContext = (0, find_medusa_context_1.findMedusaContext)(args);
                    if (medusaContext) {
                        medusaContext.requestId ?? (medusaContext.requestId = requestId);
                    }
                }
                return await resolvedModule[method].apply(resolvedModule, args);
            }
            catch (err) {
                return response.status(500).send(err.message);
            }
        });
        await fastify.listen({
            port,
            host: "0.0.0.0",
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=http.js.map