"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkRepository = void 0;
const utils_1 = require("@medusajs/utils");
function getLinkRepository(model) {
    return class LinkRepository extends (0, utils_1.mikroOrmBaseRepositoryFactory)(model) {
        constructor({ joinerConfig }) {
            // @ts-ignore
            super(...arguments);
            this.joinerConfig_ = joinerConfig;
        }
        async delete(data, context = {}) {
            const filter = {};
            for (const key in data) {
                filter[key] = {
                    $in: Array.isArray(data[key]) ? data[key] : [data[key]],
                };
            }
            const manager = this.getActiveManager(context);
            await manager.nativeDelete(model, data, {});
        }
        async create(data, context = {}) {
            const manager = this.getActiveManager(context);
            const links = data.map((link) => {
                link.id = (0, utils_1.generateEntityId)(link.id, this.joinerConfig_.databaseConfig?.idPrefix ?? "link");
                link.deleted_at = null;
                return manager.create(model, link);
            });
            await manager.upsertMany(model, links);
            return links;
        }
    };
}
exports.getLinkRepository = getLinkRepository;
