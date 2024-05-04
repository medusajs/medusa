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
exports.run = void 0;
const utils_1 = require("@medusajs/utils");
const PricingModels = __importStar(require("../models"));
const os_1 = require("os");
const path_1 = require("path");
async function run({ options, logger, path, }) {
    logger ?? (logger = console);
    logger.info(`Loading seed data from ${path}...`);
    const { priceSetsData, pricesData } = await Promise.resolve(`${(0, path_1.resolve)(process.cwd(), path)}`).then(s => __importStar(require(s))).catch((e) => {
        logger?.error(`Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following: priceSetsData and pricesData.${os_1.EOL}${e}`);
        throw e;
    });
    const dbData = utils_1.ModulesSdkUtils.loadDatabaseConfig("pricing", options);
    const entities = Object.values(PricingModels);
    const pathToMigrations = __dirname + "/../migrations";
    const orm = await utils_1.DALUtils.mikroOrmCreateConnection(dbData, entities, pathToMigrations);
    const manager = orm.em.fork();
    try {
        logger.info("Inserting price_sets & prices");
        await createPriceSets(manager, priceSetsData);
        await createPrices(manager, pricesData);
    }
    catch (e) {
        logger.error(`Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${os_1.EOL}${e}`);
    }
    await orm.close(true);
}
exports.run = run;
async function createPriceSets(manager, data) {
    const priceSets = data.map((priceSetData) => {
        return manager.create(PricingModels.PriceSet, priceSetData);
    });
    await manager.persistAndFlush(priceSets);
    return priceSets;
}
async function createPrices(manager, data) {
    const prices = data.map((priceData) => {
        return manager.create(PricingModels.Price, priceData);
    });
    await manager.persistAndFlush(prices);
    return prices;
}
