"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryRepository = exports.tempReorderRank = void 0;
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const _models_1 = require("../models");
exports.tempReorderRank = 99999;
// eslint-disable-next-line max-len
class ProductCategoryRepository extends utils_1.DALUtils.MikroOrmBaseTreeRepository {
    buildFindOptions(findOptions = { where: {} }, familyOptions = {}) {
        var _a, _b;
        const findOptions_ = { ...findOptions };
        findOptions_.options ?? (findOptions_.options = {});
        const fields = ((_a = findOptions_.options).fields ?? (_a.fields = []));
        const populate = ((_b = findOptions_.options).populate ?? (_b.populate = []));
        // Ref: Building descendants
        // mpath and parent_category_id needs to be added to the query for the tree building to be done accurately
        if (familyOptions.includeDescendantsTree ||
            familyOptions.includeAncestorsTree) {
            fields.indexOf("mpath") === -1 && fields.push("mpath");
            fields.indexOf("parent_category_id") === -1 &&
                fields.push("parent_category_id");
        }
        const shouldExpandParent = familyOptions.includeAncestorsTree || fields.includes("parent_category");
        if (shouldExpandParent) {
            populate.indexOf("parent_category") === -1 &&
                populate.push("parent_category");
        }
        const shouldExpandChildren = familyOptions.includeDescendantsTree ||
            fields.includes("category_children");
        if (shouldExpandChildren) {
            populate.indexOf("category_children") === -1 &&
                populate.push("category_children");
        }
        Object.assign(findOptions_.options, {
            strategy: core_1.LoadStrategy.SELECT_IN,
        });
        return findOptions_;
    }
    async find(findOptions = { where: {} }, transformOptions = {}, context = {}) {
        const manager = super.getActiveManager(context);
        const findOptions_ = this.buildFindOptions(findOptions, transformOptions);
        const productCategories = await manager.find(_models_1.ProductCategory, findOptions_.where, findOptions_.options);
        if (!transformOptions.includeDescendantsTree &&
            !transformOptions.includeAncestorsTree) {
            return productCategories;
        }
        return await this.buildProductCategoriesWithTree({
            descendants: transformOptions.includeDescendantsTree,
            ancestors: transformOptions.includeAncestorsTree,
        }, productCategories, findOptions_);
    }
    async buildProductCategoriesWithTree(include, productCategories, findOptions = { where: {} }, context = {}) {
        const manager = super.getActiveManager(context);
        const mpaths = [];
        const parentMpaths = new Set();
        for (const cat of productCategories) {
            if (include.descendants) {
                mpaths.push({ mpath: { $like: `${cat.mpath}%` } });
            }
            if (include.ancestors) {
                let parent = "";
                cat.mpath?.split(".").forEach((mpath) => {
                    if (mpath === "") {
                        return;
                    }
                    parentMpaths.add(parent + mpath + ".");
                    parent += mpath + ".";
                });
            }
        }
        mpaths.push({ mpath: Array.from(parentMpaths) });
        const whereOptions = {
            ...findOptions.where,
            $or: mpaths,
        };
        if ("parent_category_id" in whereOptions) {
            delete whereOptions.parent_category_id;
        }
        if ("id" in whereOptions) {
            delete whereOptions.id;
        }
        let allCategories = await manager.find(_models_1.ProductCategory, whereOptions, findOptions.options);
        allCategories = JSON.parse(JSON.stringify(allCategories));
        const categoriesById = new Map(allCategories.map((cat) => [cat.id, cat]));
        allCategories.forEach((cat) => {
            if (cat.parent_category_id) {
                cat.parent_category = categoriesById.get(cat.parent_category_id);
            }
        });
        const populateChildren = (category, level = 0) => {
            const categories = allCategories.filter((child) => child.parent_category_id === category.id);
            if (include.descendants) {
                category.category_children = categories.map((child) => {
                    return populateChildren(categoriesById.get(child.id), level + 1);
                });
            }
            if (level === 0) {
                return category;
            }
            if (include.ancestors) {
                delete category.category_children;
            }
            if (include.descendants) {
                delete category.parent_category;
            }
            return category;
        };
        const populatedProductCategories = productCategories.map((cat) => {
            const fullCategory = categoriesById.get(cat.id);
            return populateChildren(fullCategory);
        });
        return populatedProductCategories;
    }
    async findAndCount(findOptions = { where: {} }, transformOptions = {}, context = {}) {
        const manager = super.getActiveManager(context);
        const findOptions_ = this.buildFindOptions(findOptions, transformOptions);
        const [productCategories, count] = await manager.findAndCount(_models_1.ProductCategory, findOptions_.where, findOptions_.options);
        if (!transformOptions.includeDescendantsTree &&
            !transformOptions.includeAncestorsTree) {
            return [productCategories, count];
        }
        return [
            await this.buildProductCategoriesWithTree({
                descendants: transformOptions.includeDescendantsTree,
                ancestors: transformOptions.includeAncestorsTree,
            }, productCategories, findOptions_),
            count,
        ];
    }
    async delete(id, context = {}) {
        const manager = super.getActiveManager(context);
        const productCategory = await manager.findOneOrFail(_models_1.ProductCategory, { id }, {
            populate: ["category_children"],
        });
        if (productCategory.category_children.length > 0) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, `Deleting ProductCategory (${id}) with category children is not allowed`);
        }
        const conditions = this.fetchReorderConditions(productCategory, {
            parent_category_id: productCategory.parent_category_id,
            rank: productCategory.rank,
        }, true);
        await this.performReordering(manager, conditions);
        await manager.nativeDelete(_models_1.ProductCategory, { id: id }, {});
    }
    async create(data, context = {}) {
        const categoryData = { ...data };
        const manager = super.getActiveManager(context);
        const siblings = await manager.find(_models_1.ProductCategory, {
            parent_category_id: categoryData?.parent_category_id || null,
        });
        if (!(0, utils_1.isDefined)(categoryData.rank)) {
            categoryData.rank = siblings.length;
        }
        const productCategory = manager.create(_models_1.ProductCategory, categoryData);
        manager.persist(productCategory);
        return productCategory;
    }
    async update(id, data, context = {}) {
        const categoryData = { ...data };
        const manager = super.getActiveManager(context);
        const productCategory = await manager.findOneOrFail(_models_1.ProductCategory, { id });
        const conditions = this.fetchReorderConditions(productCategory, categoryData);
        if (conditions.shouldChangeRank || conditions.shouldChangeParent) {
            categoryData.rank = exports.tempReorderRank;
        }
        // await this.transformParentIdToEntity(categoryData)
        for (const key in categoryData) {
            if ((0, utils_1.isDefined)(categoryData[key])) {
                productCategory[key] = categoryData[key];
            }
        }
        manager.assign(productCategory, categoryData);
        manager.persist(productCategory);
        await this.performReordering(manager, conditions);
        return productCategory;
    }
    fetchReorderConditions(productCategory, data, shouldDeleteElement = false) {
        const originalParentId = productCategory.parent_category_id || null;
        const targetParentId = data.parent_category_id;
        const originalRank = productCategory.rank || 0;
        const targetRank = data.rank;
        const shouldChangeParent = targetParentId !== undefined && targetParentId !== originalParentId;
        const shouldChangeRank = shouldChangeParent ||
            ((0, utils_1.isDefined)(targetRank) && originalRank !== targetRank);
        return {
            targetCategoryId: productCategory.id,
            originalParentId,
            targetParentId,
            originalRank,
            targetRank,
            shouldChangeParent,
            shouldChangeRank,
            shouldIncrementRank: false,
            shouldDeleteElement,
        };
    }
    async performReordering(manager, conditions) {
        const { shouldChangeParent, shouldChangeRank, shouldDeleteElement } = conditions;
        if (!(shouldChangeParent || shouldChangeRank || shouldDeleteElement)) {
            return;
        }
        // If we change parent, we need to shift the siblings to eliminate the
        // rank occupied by the targetCategory in the original parent.
        shouldChangeParent &&
            (await this.shiftSiblings(manager, {
                ...conditions,
                targetRank: conditions.originalRank,
                targetParentId: conditions.originalParentId,
            }));
        // If we change parent, we need to shift the siblings of the new parent
        // to create a rank that the targetCategory will occupy.
        shouldChangeParent &&
            shouldChangeRank &&
            (await this.shiftSiblings(manager, {
                ...conditions,
                shouldIncrementRank: true,
            }));
        ((!shouldChangeParent && shouldChangeRank) || shouldDeleteElement) &&
            (await this.shiftSiblings(manager, {
                ...conditions,
                targetParentId: conditions.originalParentId,
            }));
    }
    async shiftSiblings(manager, conditions) {
        let { shouldIncrementRank, targetRank } = conditions;
        const { shouldChangeParent, originalRank, targetParentId, targetCategoryId, shouldDeleteElement, } = conditions;
        // The current sibling count will replace targetRank if
        // targetRank is greater than the count of siblings.
        const siblingCount = await manager.count(_models_1.ProductCategory, {
            parent_category_id: targetParentId || null,
            id: { $ne: targetCategoryId },
        });
        // The category record that will be placed at the requested rank
        // We've temporarily placed it at a temporary rank that is
        // beyond a reasonable value (tempReorderRank)
        const targetCategory = await manager.findOne(_models_1.ProductCategory, {
            id: targetCategoryId,
            parent_category_id: targetParentId || null,
            rank: exports.tempReorderRank,
        });
        // If the targetRank is not present, or if targetRank is beyond the
        // rank of the last category, we set the rank as the last rank
        if (targetRank === undefined || targetRank > siblingCount) {
            targetRank = siblingCount;
        }
        let rankCondition;
        // If parent doesn't change, we only need to get the ranks
        // in between the original rank and the target rank.
        if (shouldChangeParent || shouldDeleteElement) {
            rankCondition = { $gte: targetRank };
        }
        else if (originalRank > targetRank) {
            shouldIncrementRank = true;
            rankCondition = { $gte: targetRank, $lte: originalRank };
        }
        else {
            shouldIncrementRank = false;
            rankCondition = { $gte: originalRank, $lte: targetRank };
        }
        // Scope out the list of siblings that we need to shift up or down
        const siblingsToShift = await manager.find(_models_1.ProductCategory, {
            parent_category_id: targetParentId || null,
            rank: rankCondition,
            id: { $ne: targetCategoryId },
        }, {
            orderBy: { rank: shouldIncrementRank ? "DESC" : "ASC" },
        });
        // Depending on the conditions, we get a subset of the siblings
        // and independently shift them up or down a rank
        for (let index = 0; index < siblingsToShift.length; index++) {
            const sibling = siblingsToShift[index];
            // Depending on the condition, we could also have the targetCategory
            // in the siblings list, we skip shifting the target until all other siblings
            // have been shifted.
            if (sibling.id === targetCategoryId) {
                continue;
            }
            if (!(0, utils_1.isDefined)(sibling.rank)) {
                throw new Error("sibling rank is not defined");
            }
            const rank = shouldIncrementRank ? ++sibling.rank : --sibling.rank;
            manager.assign(sibling, { rank });
            manager.persist(sibling);
        }
        // The targetCategory will not be present in the query when we are shifting
        // siblings of the old parent of the targetCategory.
        if (!targetCategory) {
            return;
        }
        // Place the targetCategory in the requested rank
        manager.assign(targetCategory, { rank: targetRank });
        manager.persist(targetCategory);
    }
}
exports.ProductCategoryRepository = ProductCategoryRepository;
