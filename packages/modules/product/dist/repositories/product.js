"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const _models_1 = require("../models");
const utils_1 = require("@medusajs/utils");
// eslint-disable-next-line max-len
class ProductRepository extends utils_1.DALUtils.mikroOrmBaseRepositoryFactory(_models_1.Product) {
    constructor(...args) {
        // @ts-ignore
        super(...arguments);
    }
    /**
     * In order to be able to have a strict not in categories, and prevent a product
     * to be return in the case it also belongs to other categories, we need to
     * first find all products that are in the categories, and then exclude them
     */
    async mutateNotInCategoriesConstraints(findOptions = { where: {} }, context = {}) {
        const manager = this.getActiveManager(context);
        if ("categories" in findOptions.where &&
            findOptions.where.categories?.id?.["$nin"]) {
            const productsInCategories = await manager.find(_models_1.Product, {
                categories: {
                    id: { $in: findOptions.where.categories.id["$nin"] },
                },
            }, {
                fields: ["id"],
            });
            const productIds = productsInCategories.map((product) => product.id);
            if (productIds.length) {
                findOptions.where.id = { $nin: productIds };
                delete findOptions.where.categories?.id;
                if (Object.keys(findOptions.where.categories).length === 0) {
                    delete findOptions.where.categories;
                }
            }
        }
    }
}
exports.ProductRepository = ProductRepository;
