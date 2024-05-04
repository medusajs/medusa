"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const ioredis_1 = __importDefault(require("ioredis"));
exports.default = async ({ container, logger, options, dataLoaderOnly, }) => {
    const { url, options: redisOptions, pubsub, } = options?.redis;
    // TODO: get default from ENV VAR
    if (!url) {
        throw Error("No `redis.url` provided in `workflowOrchestrator` module options. It is required for the Workflow Orchestrator Redis.");
    }
    const cnnPubSub = pubsub ?? { url, options: redisOptions };
    const queueName = options?.queueName ?? "medusa-workflows";
    let connection;
    let redisPublisher;
    let redisSubscriber;
    let workerConnection;
    try {
        connection = await getConnection(url, redisOptions);
        workerConnection = await getConnection(url, {
            ...(redisOptions ?? {}),
            maxRetriesPerRequest: null,
        });
        logger?.info(`Connection to Redis in module 'workflow-engine-redis' established`);
    }
    catch (err) {
        logger?.error(`An error occurred while connecting to Redis in module 'workflow-engine-redis': ${err}`);
    }
    try {
        redisPublisher = await getConnection(cnnPubSub.url, cnnPubSub.options);
        redisSubscriber = await getConnection(cnnPubSub.url, cnnPubSub.options);
        logger?.info(`Connection to Redis PubSub in module 'workflow-engine-redis' established`);
    }
    catch (err) {
        logger?.error(`An error occurred while connecting to Redis PubSub in module 'workflow-engine-redis': ${err}`);
    }
    container.register({
        partialLoading: (0, awilix_1.asValue)(true),
        redisConnection: (0, awilix_1.asValue)(connection),
        redisWorkerConnection: (0, awilix_1.asValue)(workerConnection),
        redisPublisher: (0, awilix_1.asValue)(redisPublisher),
        redisSubscriber: (0, awilix_1.asValue)(redisSubscriber),
        redisQueueName: (0, awilix_1.asValue)(queueName),
        redisDisconnectHandler: (0, awilix_1.asValue)(async () => {
            connection.disconnect();
            workerConnection.disconnect();
            redisPublisher.disconnect();
            redisSubscriber.disconnect();
        }),
    });
};
async function getConnection(url, redisOptions) {
    const connection = new ioredis_1.default(url, {
        lazyConnect: true,
        ...(redisOptions ?? {}),
    });
    await new Promise(async (resolve) => {
        await connection.connect(resolve);
    });
    return connection;
}
