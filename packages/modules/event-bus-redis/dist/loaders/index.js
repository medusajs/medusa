"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const ioredis_1 = __importDefault(require("ioredis"));
const os_1 = require("os");
exports.default = async ({ container, logger, options, }) => {
    const { redisUrl, redisOptions } = options;
    if (!redisUrl) {
        throw Error("No `redis_url` provided in project config. It is required for the Redis Event Bus.");
    }
    const connection = new ioredis_1.default(redisUrl, {
        // Required config. See: https://github.com/OptimalBits/bull/blob/develop/CHANGELOG.md#breaking-changes
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        // Lazy connect to properly handle connection errors
        lazyConnect: true,
        ...(redisOptions ?? {}),
    });
    try {
        await new Promise(async (resolve) => {
            await connection.connect(resolve);
        });
        logger?.info(`Connection to Redis in module 'event-bus-redis' established`);
    }
    catch (err) {
        logger?.error(`An error occurred while connecting to Redis in module 'event-bus-redis':${os_1.EOL} ${err}`);
    }
    container.register({
        eventBusRedisConnection: (0, awilix_1.asValue)(connection),
    });
};
//# sourceMappingURL=index.js.map