"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@medusajs/types");
const _models_1 = require("../models");
const utils_1 = require("@medusajs/utils");
const types_2 = require("../types");
const joiner_config_1 = require("./../joiner-config");
const generateMethodForModels = [
    { model: _models_1.ProductCategory, singular: "Category", plural: "Categories" },
    { model: _models_1.ProductCollection, singular: "Collection", plural: "Collections" },
    { model: _models_1.ProductOption, singular: "Option", plural: "Options" },
    { model: _models_1.ProductTag, singular: "Tag", plural: "Tags" },
    { model: _models_1.ProductType, singular: "Type", plural: "Types" },
    { model: _models_1.ProductVariant, singular: "Variant", plural: "Variants" },
];
class ProductModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.Product, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, productService, productVariantService, productTagService, productCategoryService, productCollectionService, productImageService, productTypeService, productOptionService, productOptionValueService, eventBusModuleService, }, moduleDeclaration) {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.productService_ = productService;
        this.productVariantService_ = productVariantService;
        this.productTagService_ = productTagService;
        this.productCategoryService_ = productCategoryService;
        this.productCollectionService_ = productCollectionService;
        this.productImageService_ = productImageService;
        this.productTypeService_ = productTypeService;
        this.productOptionService_ = productOptionService;
        this.productOptionValueService_ = productOptionValueService;
        this.eventBusModuleService_ = eventBusModuleService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    async createVariants(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const variants = await this.createVariants_(input, sharedContext);
        const createdVariants = await this.baseRepository_.serialize(variants);
        return Array.isArray(data) ? createdVariants : createdVariants[0];
    }
    async createVariants_(data, sharedContext = {}) {
        if (data.some((v) => !v.product_id)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Tried to create variants without specifying a product_id");
        }
        const productOptions = await this.productOptionService_.list({
            product_id: [...new Set(data.map((v) => v.product_id))],
        }, {
            take: null,
            relations: ["values"],
        }, sharedContext);
        const productVariantsWithOptions = ProductModuleService.assignOptionsToVariants(data, productOptions);
        return await this.productVariantService_.create(productVariantsWithOptions, sharedContext);
    }
    async upsertVariants(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((variant) => !!variant.id);
        const forCreate = input.filter((variant) => !variant.id);
        let created = [];
        let updated = [];
        if (forCreate.length) {
            created = await this.createVariants_(forCreate, sharedContext);
        }
        if (forUpdate.length) {
            updated = await this.updateVariants_(forUpdate, sharedContext);
        }
        const result = [...created, ...updated];
        const allVariants = await this.baseRepository_.serialize(result);
        return Array.isArray(data) ? allVariants : allVariants[0];
    }
    async updateVariants(idOrSelector, data, sharedContext = {}) {
        let normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        else {
            const variants = await this.productVariantService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = variants.map((variant) => ({
                id: variant.id,
                ...data,
            }));
        }
        const variants = await this.updateVariants_(normalizedInput, sharedContext);
        const updatedVariants = await this.baseRepository_.serialize(variants);
        return (0, utils_1.isString)(idOrSelector) ? updatedVariants[0] : updatedVariants;
    }
    async updateVariants_(data, sharedContext = {}) {
        // Validation step
        const variantIdsToUpdate = data.map(({ id }) => id);
        const variants = await this.productVariantService_.list({ id: variantIdsToUpdate }, { take: null }, sharedContext);
        if (variants.length !== data.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Cannot update non-existing variants with ids: ${(0, utils_1.arrayDifference)(variantIdsToUpdate, variants.map(({ id }) => id)).join(", ")}`);
        }
        // Data normalization
        const variantsWithProductId = variants.map((v) => ({
            ...data.find((d) => d.id === v.id),
            id: v.id,
            product_id: v.product_id,
        }));
        const productOptions = await this.productOptionService_.list({
            product_id: Array.from(new Set(variantsWithProductId.map((v) => v.product_id))),
        }, { take: null, relations: ["values"] }, sharedContext);
        return this.productVariantService_.upsertWithReplace(ProductModuleService.assignOptionsToVariants(variantsWithProductId, productOptions), {
            relations: ["options"],
        }, sharedContext);
    }
    async createTags(data, sharedContext = {}) {
        const productTags = await this.productTagService_.create(data, sharedContext);
        return await this.baseRepository_.serialize(productTags);
    }
    async updateTags(data, sharedContext = {}) {
        const productTags = await this.productTagService_.update(data, sharedContext);
        return await this.baseRepository_.serialize(productTags);
    }
    async createTypes(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const types = await this.productTypeService_.create(input, sharedContext);
        const createdTypes = await this.baseRepository_.serialize(types);
        return Array.isArray(data) ? createdTypes : createdTypes[0];
    }
    async upsertTypes(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((type) => !!type.id);
        const forCreate = input.filter((type) => !type.id);
        let created = [];
        let updated = [];
        if (forCreate.length) {
            created = await this.productTypeService_.create(forCreate, sharedContext);
        }
        if (forUpdate.length) {
            updated = await this.productTypeService_.update(forUpdate, sharedContext);
        }
        const result = [...created, ...updated];
        const allTypes = await this.baseRepository_.serialize(result);
        return Array.isArray(data) ? allTypes : allTypes[0];
    }
    async updateTypes(idOrSelector, data, sharedContext = {}) {
        let normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            // Check if the type exists in the first place
            await this.productTypeService_.retrieve(idOrSelector, {}, sharedContext);
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        else {
            const types = await this.productTypeService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = types.map((type) => ({
                id: type.id,
                ...data,
            }));
        }
        const types = await this.productTypeService_.update(normalizedInput, sharedContext);
        const updatedTypes = await this.baseRepository_.serialize(types);
        return (0, utils_1.isString)(idOrSelector) ? updatedTypes[0] : updatedTypes;
    }
    async createOptions(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const options = await this.createOptions_(input, sharedContext);
        const createdOptions = await this.baseRepository_.serialize(options);
        return Array.isArray(data) ? createdOptions : createdOptions[0];
    }
    async createOptions_(data, sharedContext = {}) {
        if (data.some((v) => !v.product_id)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Tried to create options without specifying a product_id");
        }
        const normalizedInput = data.map((opt) => {
            return {
                ...opt,
                values: opt.values?.map((v) => {
                    return typeof v === "string" ? { value: v } : v;
                }),
            };
        });
        return await this.productOptionService_.create(normalizedInput, sharedContext);
    }
    async upsertOptions(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((option) => !!option.id);
        const forCreate = input.filter((option) => !option.id);
        let created = [];
        let updated = [];
        if (forCreate.length) {
            created = await this.createOptions_(forCreate, sharedContext);
        }
        if (forUpdate.length) {
            updated = await this.updateOptions_(forUpdate, sharedContext);
        }
        const result = [...created, ...updated];
        const allOptions = await this.baseRepository_.serialize(result);
        return Array.isArray(data) ? allOptions : allOptions[0];
    }
    async updateOptions(idOrSelector, data, sharedContext = {}) {
        let normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            await this.productOptionService_.retrieve(idOrSelector, {}, sharedContext);
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        else {
            const options = await this.productOptionService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = options.map((option) => ({
                id: option.id,
                ...data,
            }));
        }
        const options = await this.updateOptions_(normalizedInput, sharedContext);
        const updatedOptions = await this.baseRepository_.serialize(options);
        return (0, utils_1.isString)(idOrSelector) ? updatedOptions[0] : updatedOptions;
    }
    async updateOptions_(data, sharedContext = {}) {
        // Validation step
        if (data.some((option) => !option.id)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Tried to update options without specifying an ID");
        }
        const dbOptions = await this.productOptionService_.list({ id: data.map(({ id }) => id) }, { take: null, relations: ["values"] }, sharedContext);
        if (dbOptions.length !== data.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Cannot update non-existing options with ids: ${(0, utils_1.arrayDifference)(data.map(({ id }) => id), dbOptions.map(({ id }) => id)).join(", ")}`);
        }
        // Data normalization
        const normalizedInput = data.map((opt) => {
            const dbValues = dbOptions.find(({ id }) => id === opt.id)?.values || [];
            const normalizedValues = opt.values?.map((v) => {
                return typeof v === "string" ? { value: v } : v;
            });
            return {
                ...opt,
                ...(normalizedValues
                    ? {
                        // Oftentimes the options are only passed by value without an id, even if they exist in the DB
                        values: normalizedValues.map((normVal) => {
                            if ("id" in normVal) {
                                return normVal;
                            }
                            const dbVal = dbValues.find((dbVal) => dbVal.value === normVal.value);
                            if (!dbVal) {
                                return normVal;
                            }
                            return {
                                id: dbVal.id,
                                value: normVal.value,
                            };
                        }),
                    }
                    : {}),
            };
        });
        return await this.productOptionService_.upsertWithReplace(normalizedInput, { relations: ["values"] }, sharedContext);
    }
    async createCollections(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const collections = await this.createCollections_(input, sharedContext);
        const createdCollections = await this.baseRepository_.serialize(collections);
        await this.eventBusModuleService_?.emit(collections.map(({ id }) => ({
            eventName: types_2.ProductCollectionEvents.COLLECTION_CREATED,
            data: { id },
        })));
        return Array.isArray(data) ? createdCollections : createdCollections[0];
    }
    async createCollections_(data, sharedContext = {}) {
        const normalizedInput = data.map(ProductModuleService.normalizeCreateProductCollectionInput);
        // It's safe to use upsertWithReplace here since we only have product IDs and the only operation to do is update the product
        // with the collection ID
        return await this.productCollectionService_.upsertWithReplace(normalizedInput, { relations: ["products"] }, sharedContext);
    }
    async upsertCollections(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((collection) => !!collection.id);
        const forCreate = input.filter((collection) => !collection.id);
        let created = [];
        let updated = [];
        if (forCreate.length) {
            created = await this.createCollections_(forCreate, sharedContext);
        }
        if (forUpdate.length) {
            updated = await this.updateCollections_(forUpdate, sharedContext);
        }
        const result = [...created, ...updated];
        const allCollections = await this.baseRepository_.serialize(result);
        if (created.length) {
            await this.eventBusModuleService_?.emit(created.map(({ id }) => ({
                eventName: types_2.ProductCollectionEvents.COLLECTION_CREATED,
                data: { id },
            })));
        }
        if (updated.length) {
            await this.eventBusModuleService_?.emit(updated.map(({ id }) => ({
                eventName: types_2.ProductCollectionEvents.COLLECTION_UPDATED,
                data: { id },
            })));
        }
        return Array.isArray(data) ? allCollections : allCollections[0];
    }
    async updateCollections(idOrSelector, data, sharedContext = {}) {
        let normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            await this.productCollectionService_.retrieve(idOrSelector, {}, sharedContext);
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        else {
            const collections = await this.productCollectionService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = collections.map((collection) => ({
                id: collection.id,
                ...data,
            }));
        }
        const collections = await this.updateCollections_(normalizedInput, sharedContext);
        const updatedCollections = await this.baseRepository_.serialize(collections);
        await this.eventBusModuleService_?.emit(updatedCollections.map(({ id }) => ({
            eventName: types_2.ProductCollectionEvents.COLLECTION_UPDATED,
            data: { id },
        })));
        return (0, utils_1.isString)(idOrSelector) ? updatedCollections[0] : updatedCollections;
    }
    async updateCollections_(data, sharedContext = {}) {
        const normalizedInput = data.map(ProductModuleService.normalizeUpdateProductCollectionInput);
        // TODO: Maybe we can update upsertWithReplace to not remove oneToMany entities, but just disassociate them? With that we can remove the code below.
        // Another alternative is to not allow passing product_ids to a collection, and instead set the collection_id through the product update call.
        const updatedCollections = await this.productCollectionService_.update(normalizedInput.map((c) => (0, utils_1.removeUndefined)({ ...c, products: undefined })), sharedContext);
        const collectionWithProducts = await (0, utils_1.promiseAll)(updatedCollections.map(async (collection, i) => {
            const input = normalizedInput.find((c) => c.id === collection.id);
            const productsToUpdate = input?.products;
            if (!productsToUpdate) {
                return { ...collection, products: [] };
            }
            await this.productService_.update({
                selector: { collection_id: collection.id },
                data: { collection_id: null },
            }, sharedContext);
            if (productsToUpdate.length > 0) {
                await this.productService_.update(productsToUpdate.map((p) => ({
                    id: p.id,
                    collection_id: collection.id,
                })), sharedContext);
            }
            return { ...collection, products: productsToUpdate };
        }));
        return collectionWithProducts;
    }
    async createCategory(data, sharedContext = {}) {
        const result = await this.createCategory_(data, sharedContext);
        return await this.baseRepository_.serialize(result);
    }
    async createCategory_(data, sharedContext = {}) {
        const productCategory = await this.productCategoryService_.create(data, sharedContext);
        await this.eventBusModuleService_?.emit(types_2.ProductCategoryEvents.CATEGORY_CREATED, { id: productCategory.id });
        return productCategory;
    }
    async updateCategory(categoryId, data, sharedContext = {}) {
        const productCategory = await this.productCategoryService_.update(categoryId, data, sharedContext);
        await this.eventBusModuleService_?.emit(types_2.ProductCategoryEvents.CATEGORY_UPDATED, { id: productCategory.id });
        return await this.baseRepository_.serialize(productCategory, {
            populate: true,
        });
    }
    async deleteCategory(categoryId, sharedContext = {}) {
        await this.productCategoryService_.delete(categoryId, sharedContext);
        await this.eventBusModuleService_?.emit(types_2.ProductCategoryEvents.CATEGORY_DELETED, { id: categoryId });
    }
    async create(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const products = await this.create_(input, sharedContext);
        const createdProducts = await this.baseRepository_.serialize(products);
        await this.eventBusModuleService_?.emit(createdProducts.map(({ id }) => ({
            eventName: types_2.ProductEvents.PRODUCT_CREATED,
            data: { id },
        })));
        return Array.isArray(data) ? createdProducts : createdProducts[0];
    }
    async upsert(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const forUpdate = input.filter((product) => !!product.id);
        const forCreate = input.filter((product) => !product.id);
        let created = [];
        let updated = [];
        if (forCreate.length) {
            created = await this.create_(forCreate, sharedContext);
        }
        if (forUpdate.length) {
            updated = await this.update_(forUpdate, sharedContext);
        }
        const result = [...created, ...updated];
        const allProducts = await this.baseRepository_.serialize(result);
        if (created.length) {
            await this.eventBusModuleService_?.emit(created.map(({ id }) => ({
                eventName: types_2.ProductEvents.PRODUCT_CREATED,
                data: { id },
            })));
        }
        if (updated.length) {
            await this.eventBusModuleService_?.emit(updated.map(({ id }) => ({
                eventName: types_2.ProductEvents.PRODUCT_UPDATED,
                data: { id },
            })));
        }
        return Array.isArray(data) ? allProducts : allProducts[0];
    }
    async update(idOrSelector, data, sharedContext = {}) {
        let normalizedInput = [];
        if ((0, utils_1.isString)(idOrSelector)) {
            // This will throw if the product does not exist
            await this.productService_.retrieve(idOrSelector, {}, sharedContext);
            normalizedInput = [{ id: idOrSelector, ...data }];
        }
        else {
            const products = await this.productService_.list(idOrSelector, {}, sharedContext);
            normalizedInput = products.map((product) => ({
                id: product.id,
                ...data,
            }));
        }
        const products = await this.update_(normalizedInput, sharedContext);
        const updatedProducts = await this.baseRepository_.serialize(products);
        await this.eventBusModuleService_?.emit(updatedProducts.map(({ id }) => ({
            eventName: types_2.ProductEvents.PRODUCT_UPDATED,
            data: { id },
        })));
        return (0, utils_1.isString)(idOrSelector) ? updatedProducts[0] : updatedProducts;
    }
    async create_(data, sharedContext = {}) {
        const normalizedInput = await (0, utils_1.promiseAll)(data.map(async (d) => await this.normalizeCreateProductInput(d, sharedContext)));
        const productData = await this.productService_.upsertWithReplace(normalizedInput, {
            relations: ["images", "tags", "categories"],
        }, sharedContext);
        await (0, utils_1.promiseAll)(
        // Note: It's safe to rely on the order here as `upsertWithReplace` preserves the order of the input
        normalizedInput.map(async (product, i) => {
            const upsertedProduct = productData[i];
            upsertedProduct.options = [];
            upsertedProduct.variants = [];
            if (product.options?.length) {
                upsertedProduct.options =
                    await this.productOptionService_.upsertWithReplace(product.options?.map((option) => ({
                        ...option,
                        product_id: upsertedProduct.id,
                    })) ?? [], { relations: ["values"] }, sharedContext);
            }
            if (product.variants?.length) {
                upsertedProduct.variants =
                    await this.productVariantService_.upsertWithReplace(ProductModuleService.assignOptionsToVariants(product.variants?.map((v) => ({
                        ...v,
                        product_id: upsertedProduct.id,
                    })) ?? [], upsertedProduct.options), { relations: ["options"] }, sharedContext);
            }
        }));
        return productData;
    }
    async update_(data, sharedContext = {}) {
        const normalizedInput = await (0, utils_1.promiseAll)(data.map(async (d) => await this.normalizeUpdateProductInput(d, sharedContext)));
        const productData = await this.productService_.upsertWithReplace(normalizedInput, {
            relations: ["images", "tags", "categories"],
        }, sharedContext);
        // There is more than 1-level depth of relations here, so we need to handle the options and variants manually
        await (0, utils_1.promiseAll)(
        // Note: It's safe to rely on the order here as `upsertWithReplace` preserves the order of the input
        normalizedInput.map(async (product, i) => {
            const upsertedProduct = productData[i];
            let allOptions = [];
            if (product.options?.length) {
                upsertedProduct.options =
                    await this.productOptionService_.upsertWithReplace(product.options?.map((option) => ({
                        ...option,
                        product_id: upsertedProduct.id,
                    })) ?? [], { relations: ["values"] }, sharedContext);
                // Since we handle the options and variants outside of the product upsert, we need to clean up manually
                await this.productOptionService_.delete({
                    product_id: upsertedProduct.id,
                    id: {
                        $nin: upsertedProduct.options.map(({ id }) => id),
                    },
                }, sharedContext);
                allOptions = upsertedProduct.options;
            }
            else {
                // If the options weren't affected, but the user is changing the variants, make sure we have all options available locally
                if (product.variants?.length) {
                    allOptions = await this.productOptionService_.list({ product_id: upsertedProduct.id }, { take: null, relations: ["values"] }, sharedContext);
                }
            }
            if (product.variants?.length) {
                upsertedProduct.variants =
                    await this.productVariantService_.upsertWithReplace(ProductModuleService.assignOptionsToVariants(product.variants?.map((v) => ({
                        ...v,
                        product_id: upsertedProduct.id,
                    })) ?? [], allOptions), { relations: ["options"] }, sharedContext);
                await this.productVariantService_.delete({
                    product_id: upsertedProduct.id,
                    id: {
                        $nin: upsertedProduct.variants.map(({ id }) => id),
                    },
                }, sharedContext);
            }
        }));
        return productData;
    }
    async normalizeCreateProductInput(product, sharedContext = {}) {
        const productData = (await this.normalizeUpdateProductInput(product, sharedContext));
        if (!productData.handle && productData.title) {
            productData.handle = (0, utils_1.kebabCase)(productData.title);
        }
        if (!productData.status) {
            productData.status = utils_1.ProductStatus.DRAFT;
        }
        if (!productData.thumbnail && productData.images?.length) {
            productData.thumbnail = productData.images[0].url;
        }
        return productData;
    }
    async normalizeUpdateProductInput(product, sharedContext = {}) {
        const productData = { ...product };
        if (productData.is_giftcard) {
            productData.discountable = false;
        }
        if (productData.tags?.length && productData.tags.some((t) => !t.id)) {
            const dbTags = await this.productTagService_.list({
                value: productData.tags
                    .map((t) => t.value)
                    .filter((v) => !!v),
            }, { take: null }, sharedContext);
            productData.tags = productData.tags.map((tag) => {
                const dbTag = dbTags.find((t) => t.value === tag.value);
                return {
                    ...tag,
                    ...(dbTag ? { id: dbTag.id } : {}),
                };
            });
        }
        if (productData.options?.length) {
            ;
            productData.options = productData.options?.map((option) => {
                return {
                    title: option.title,
                    values: option.values?.map((value) => {
                        return {
                            value: value,
                        };
                    }),
                };
            });
        }
        if (productData.category_ids) {
            ;
            productData.categories = productData.category_ids.map((cid) => ({
                id: cid,
            }));
            delete productData.category_ids;
        }
        return productData;
    }
    static normalizeCreateProductCollectionInput(collection) {
        const collectionData = ProductModuleService.normalizeUpdateProductCollectionInput(collection);
        if (!collectionData.handle && collectionData.title) {
            collectionData.handle = (0, utils_1.kebabCase)(collectionData.title);
        }
        return collectionData;
    }
    static normalizeUpdateProductCollectionInput(collection) {
        const collectionData = { ...collection };
        if (collectionData.product_ids?.length) {
            ;
            collectionData.products = collectionData.product_ids.map((pid) => ({
                id: pid,
            }));
            delete collectionData.product_ids;
        }
        return collectionData;
    }
    static assignOptionsToVariants(variants, options) {
        if (!variants.length) {
            return variants;
        }
        const variantsWithOptions = variants.map((variant) => {
            const variantOptions = Object.entries(variant.options ?? {}).map(([key, val]) => {
                const option = options.find((o) => o.title === key);
                const optionValue = option?.values?.find((v) => (v.value?.value ?? v.value) === val);
                if (!optionValue) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Option value ${val} does not exist for option ${key}`);
                }
                return {
                    id: optionValue.id,
                };
            });
            if (!variantOptions.length) {
                return variant;
            }
            return {
                ...variant,
                options: variantOptions,
            };
        });
        return variantsWithOptions;
    }
}
exports.default = ProductModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createVariants", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createVariants_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "upsertVariants", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateVariants", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateVariants_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createTags", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateTags", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createTypes", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "upsertTypes", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateTypes", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createOptions", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createOptions_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "upsertOptions", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateOptions", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateOptions_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createCollections", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createCollections_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "upsertCollections", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateCollections", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateCollections_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createCategory", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "createCategory_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "updateCategory", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "deleteCategory", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "upsert", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "update_", null);
__decorate([
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "normalizeCreateProductInput", null);
__decorate([
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductModuleService.prototype, "normalizeUpdateProductInput", null);
