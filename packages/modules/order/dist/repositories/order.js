"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const _models_1 = require("../models");
const transform_order_1 = require("../utils/transform-order");
class OrderRepository extends utils_1.DALUtils.mikroOrmBaseRepositoryFactory(_models_1.Order) {
    async find(options, context) {
        var _a, _b, _c, _d;
        const manager = this.getActiveManager(context);
        const knex = manager.getKnex();
        const findOptions_ = { ...options };
        findOptions_.options ?? (findOptions_.options = {});
        findOptions_.where ?? (findOptions_.where = {});
        if (!("strategy" in findOptions_.options)) {
            if (findOptions_.options.limit != null || findOptions_.options.offset) {
                Object.assign(findOptions_.options, {
                    strategy: core_1.LoadStrategy.SELECT_IN,
                });
            }
            else {
                Object.assign(findOptions_.options, {
                    strategy: core_1.LoadStrategy.JOINED,
                });
            }
        }
        const config = (0, transform_order_1.mapRepositoryToOrderModel)(findOptions_);
        let defaultVersion = knex.raw(`"o0"."version"`);
        const strategy = config.options.strategy ?? core_1.LoadStrategy.JOINED;
        if (strategy === core_1.LoadStrategy.SELECT_IN) {
            const sql = manager
                .qb(_models_1.Order, "_sub0")
                .select("version")
                .where({ id: knex.raw(`"o0"."order_id"`) })
                .getKnexQuery()
                .toString();
            defaultVersion = knex.raw(`(${sql})`);
        }
        const version = config.where.version ?? defaultVersion;
        delete config.where?.version;
        (_a = config.options).populateWhere ?? (_a.populateWhere = {});
        (_b = config.options.populateWhere).items ?? (_b.items = {});
        config.options.populateWhere.items.version = version;
        (_c = config.options.populateWhere).summary ?? (_c.summary = {});
        config.options.populateWhere.summary.version = version;
        (_d = config.options.populateWhere).shipping_methods ?? (_d.shipping_methods = {});
        config.options.populateWhere.shipping_methods.version = version;
        if (!config.options.orderBy) {
            config.options.orderBy = { id: "ASC" };
        }
        return await manager.find(_models_1.Order, config.where, config.options);
    }
    async findAndCount(findOptions = { where: {} }, context = {}) {
        var _a, _b, _c, _d;
        const manager = this.getActiveManager(context);
        const knex = manager.getKnex();
        const findOptions_ = { ...findOptions };
        findOptions_.options ?? (findOptions_.options = {});
        findOptions_.where ?? (findOptions_.where = {});
        if (!("strategy" in findOptions_.options)) {
            Object.assign(findOptions_.options, {
                strategy: core_1.LoadStrategy.SELECT_IN,
            });
        }
        const config = (0, transform_order_1.mapRepositoryToOrderModel)(findOptions_);
        let defaultVersion = knex.raw(`"o0"."version"`);
        const strategy = config.options.strategy ?? core_1.LoadStrategy.JOINED;
        if (strategy === core_1.LoadStrategy.SELECT_IN) {
            const sql = manager
                .qb(_models_1.Order, "_sub0")
                .select("version")
                .where({ id: knex.raw(`"o0"."order_id"`) })
                .getKnexQuery()
                .toString();
            defaultVersion = knex.raw(`(${sql})`);
        }
        const version = config.where.version ?? defaultVersion;
        delete config.where.version;
        (_a = config.options).populateWhere ?? (_a.populateWhere = {});
        (_b = config.options.populateWhere).items ?? (_b.items = {});
        config.options.populateWhere.items.version = version;
        (_c = config.options.populateWhere).summary ?? (_c.summary = {});
        config.options.populateWhere.summary.version = version;
        (_d = config.options.populateWhere).shipping_methods ?? (_d.shipping_methods = {});
        config.options.populateWhere.shipping_methods.version = version;
        if (!config.options.orderBy) {
            config.options.orderBy = { id: "ASC" };
        }
        return await manager.findAndCount(_models_1.Order, config.where, config.options);
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.js.map