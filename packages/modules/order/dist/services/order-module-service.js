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
const utils_1 = require("@medusajs/utils");
const _models_1 = require("../models");
const joiner_config_1 = require("../joiner-config");
const utils_2 = require("../utils");
const transform_order_1 = require("../utils/transform-order");
const generateMethodForModels = [
    _models_1.Address,
    _models_1.LineItem,
    _models_1.LineItemAdjustment,
    _models_1.LineItemTaxLine,
    _models_1.ShippingMethod,
    _models_1.ShippingMethodAdjustment,
    _models_1.ShippingMethodTaxLine,
    _models_1.Transaction,
    _models_1.OrderChange,
    _models_1.OrderChangeAction,
    _models_1.OrderItem,
    _models_1.OrderSummary,
    _models_1.OrderShippingMethod,
];
class OrderModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.Order, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, orderService, addressService, lineItemService, shippingMethodAdjustmentService, shippingMethodService, lineItemAdjustmentService, shippingMethodTaxLineService, lineItemTaxLineService, transactionService, orderChangeService, orderChangeActionService, orderItemService, orderSummaryService, orderShippingMethodService, }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.orderService_ = orderService;
        this.addressService_ = addressService;
        this.lineItemService_ = lineItemService;
        this.shippingMethodAdjustmentService_ = shippingMethodAdjustmentService;
        this.shippingMethodService_ = shippingMethodService;
        this.lineItemAdjustmentService_ = lineItemAdjustmentService;
        this.shippingMethodTaxLineService_ = shippingMethodTaxLineService;
        this.lineItemTaxLineService_ = lineItemTaxLineService;
        this.transactionService_ = transactionService;
        this.orderChangeService_ = orderChangeService;
        this.orderChangeActionService_ = orderChangeActionService;
        this.orderItemService_ = orderItemService;
        this.orderSummaryService_ = orderSummaryService;
        this.orderShippingMethodService_ = orderShippingMethodService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    shouldIncludeTotals(config) {
        const totalFields = [
            "total",
            "subtotal",
            "tax_total",
            "discount_total",
            "discount_tax_total",
            "original_total",
            "original_tax_total",
            "item_total",
            "item_subtotal",
            "item_tax_total",
            "original_item_total",
            "original_item_subtotal",
            "original_item_tax_total",
            "shipping_total",
            "shipping_subtotal",
            "shipping_tax_total",
            "original_shipping_tax_total",
            "original_shipping_tax_subtotal",
            "original_shipping_total",
        ];
        const includeTotals = (config?.select ?? []).some((field) => totalFields.includes(field));
        if (includeTotals) {
            this.addRelationsToCalculateTotals(config, totalFields);
        }
        return includeTotals;
    }
    addRelationsToCalculateTotals(config, totalFields) {
        config.relations ?? (config.relations = []);
        config.select ?? (config.select = []);
        const requiredFieldsForTotals = [
            "items",
            "items.tax_lines",
            "items.adjustments",
            "shipping_methods",
            "shipping_methods.tax_lines",
            "shipping_methods.adjustments",
        ];
        config.relations = (0, utils_1.deduplicate)([
            ...config.relations,
            ...requiredFieldsForTotals,
        ]);
        config.select = config.select.filter((field) => {
            return (!requiredFieldsForTotals.some((val) => val.startsWith(field)) && !totalFields.includes(field));
        });
    }
    async retrieve(id, config, sharedContext) {
        config ?? (config = {});
        const includeTotals = this.shouldIncludeTotals(config);
        const order = await super.retrieve(id, config, sharedContext);
        return (0, transform_order_1.formatOrder)(order, { includeTotals });
    }
    async list(filters, config, sharedContext) {
        config ?? (config = {});
        const includeTotals = this.shouldIncludeTotals(config);
        const orders = await super.list(filters, config, sharedContext);
        return (0, transform_order_1.formatOrder)(orders, {
            includeTotals,
        });
    }
    async listAndCount(filters, config, sharedContext) {
        config ?? (config = {});
        const includeTotals = this.shouldIncludeTotals(config);
        const [orders, count] = await super.listAndCount(filters, config, sharedContext);
        return [
            (0, transform_order_1.formatOrder)(orders, { includeTotals }),
            count,
        ];
    }
    async create(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const orders = await this.create_(input, sharedContext);
        const result = await this.list({
            id: orders.map((p) => p.id),
        }, {
            relations: [
                "shipping_address",
                "billing_address",
                "summary",
                "items",
                "items.tax_lines",
                "items.adjustments",
                "shipping_methods",
                "shipping_methods.tax_lines",
                "shipping_methods.adjustments",
                "transactions",
            ],
        }, sharedContext);
        return (Array.isArray(data) ? result : result[0]);
    }
    async create_(data, sharedContext = {}) {
        const lineItemsToCreate = [];
        const createdOrders = [];
        for (const { items, shipping_methods, ...order } of data) {
            const ord = order;
            const shippingMethods = shipping_methods?.map((sm) => {
                return {
                    shipping_method: { ...sm },
                };
            });
            ord.shipping_methods = shippingMethods;
            const orderWithTotals = (0, utils_1.decorateCartTotals)({
                ...ord,
                items,
            });
            const calculated = (0, utils_2.calculateOrderChange)({
                order: orderWithTotals,
                actions: [],
                transactions: order.transactions,
            });
            (0, utils_1.createRawPropertiesFromBigNumber)(calculated);
            ord.summary = {
                totals: calculated.summary,
            };
            const created = await this.orderService_.create(ord, sharedContext);
            createdOrders.push(created);
            if (items?.length) {
                const orderItems = items.map((item) => {
                    return {
                        ...item,
                        order_id: created.id,
                    };
                });
                lineItemsToCreate.push(...orderItems);
            }
        }
        if (lineItemsToCreate.length) {
            await this.createLineItemsBulk_(lineItemsToCreate, sharedContext);
        }
        return createdOrders;
    }
    async update(dataOrIdOrSelector, data, sharedContext = {}) {
        const result = await this.update_(dataOrIdOrSelector, data, sharedContext);
        const serializedResult = await this.baseRepository_.serialize(result, {
            populate: true,
        });
        return (0, utils_1.isString)(dataOrIdOrSelector) ? serializedResult[0] : serializedResult;
    }
    async update_(dataOrIdOrSelector, data, sharedContext = {}) {
        let toUpdate = [];
        if ((0, utils_1.isString)(dataOrIdOrSelector)) {
            toUpdate = [
                {
                    id: dataOrIdOrSelector,
                    ...data,
                },
            ];
        }
        else if (Array.isArray(dataOrIdOrSelector)) {
            toUpdate = dataOrIdOrSelector;
        }
        else {
            const orders = await this.orderService_.list({ ...dataOrIdOrSelector }, { select: ["id"] }, sharedContext);
            toUpdate = orders.map((order) => {
                return {
                    ...data,
                    id: order.id,
                };
            });
        }
        const result = await this.orderService_.update(toUpdate, sharedContext);
        return result;
    }
    async createLineItems(orderIdOrData, data, sharedContext = {}) {
        let items = [];
        if ((0, utils_1.isString)(orderIdOrData)) {
            items = await this.createLineItems_(orderIdOrData, data, sharedContext);
        }
        else {
            const data = Array.isArray(orderIdOrData)
                ? orderIdOrData
                : [orderIdOrData];
            const allOrderIds = data.map((dt) => dt.order_id);
            const order = await this.list({ id: allOrderIds }, { select: ["id", "version"] }, sharedContext);
            const mapOrderVersion = order.reduce((acc, curr) => {
                acc[curr.id] = curr.version;
                return acc;
            }, {});
            const lineItems = data.map((dt) => {
                return {
                    ...dt,
                    version: mapOrderVersion[dt.order_id],
                };
            });
            items = await this.createLineItemsBulk_(lineItems, sharedContext);
        }
        return await this.baseRepository_.serialize(items, {
            populate: true,
        });
    }
    async createLineItems_(orderId, items, sharedContext = {}) {
        const order = await this.retrieve(orderId, { select: ["id", "version"] }, sharedContext);
        const toUpdate = items.map((item) => {
            return {
                ...item,
                order_id: order.id,
                version: order.version,
            };
        });
        return await this.createLineItemsBulk_(toUpdate, sharedContext);
    }
    async createLineItemsBulk_(data, sharedContext = {}) {
        const orderItemToCreate = [];
        const lineItems = await this.lineItemService_.create(data, sharedContext);
        for (let i = 0; i < lineItems.length; i++) {
            const item = lineItems[i];
            const toCreate = data[i];
            if (toCreate.order_id) {
                orderItemToCreate.push({
                    order_id: toCreate.order_id,
                    version: toCreate.version ?? 1,
                    item_id: item.id,
                    quantity: toCreate.quantity,
                });
            }
        }
        if (orderItemToCreate.length) {
            await this.orderItemService_.create(orderItemToCreate, sharedContext);
        }
        return lineItems;
    }
    async updateLineItems(lineItemIdOrDataOrSelector, data, sharedContext = {}) {
        let items = [];
        if ((0, utils_1.isString)(lineItemIdOrDataOrSelector)) {
            const item = await this.updateLineItem_(lineItemIdOrDataOrSelector, data, sharedContext);
            return await this.baseRepository_.serialize(item, {
                populate: true,
            });
        }
        const toUpdate = Array.isArray(lineItemIdOrDataOrSelector)
            ? lineItemIdOrDataOrSelector
            : [
                {
                    selector: lineItemIdOrDataOrSelector,
                    data: data,
                },
            ];
        items = await this.updateLineItemsWithSelector_(toUpdate, sharedContext);
        return await this.baseRepository_.serialize(items, {
            populate: true,
        });
    }
    async updateLineItem_(lineItemId, data, sharedContext = {}) {
        const [item] = await this.lineItemService_.update([{ id: lineItemId, ...data }], sharedContext);
        if ("quantity" in data) {
            await this.updateOrderItemWithSelector_([
                {
                    selector: { item_id: item.id },
                    data,
                },
            ], sharedContext);
        }
        return item;
    }
    async updateLineItemsWithSelector_(updates, sharedContext = {}) {
        let toUpdate = [];
        const detailsToUpdate = [];
        for (const { selector, data } of updates) {
            const items = await this.listLineItems({ ...selector }, {}, sharedContext);
            items.forEach((item) => {
                toUpdate.push({
                    ...data,
                    id: item.id,
                });
                if ("quantity" in data) {
                    detailsToUpdate.push({
                        selector: { item_id: item.id },
                        data,
                    });
                }
            });
        }
        if (detailsToUpdate.length) {
            await this.updateOrderItemWithSelector_(detailsToUpdate, sharedContext);
        }
        return await this.lineItemService_.update(toUpdate, sharedContext);
    }
    async updateOrderItem(orderItemIdOrDataOrSelector, data, sharedContext = {}) {
        let items = [];
        if ((0, utils_1.isString)(orderItemIdOrDataOrSelector)) {
            const item = await this.updateOrderItem_(orderItemIdOrDataOrSelector, data, sharedContext);
            return await this.baseRepository_.serialize(item, {
                populate: true,
            });
        }
        const toUpdate = Array.isArray(orderItemIdOrDataOrSelector)
            ? orderItemIdOrDataOrSelector
            : [
                {
                    selector: orderItemIdOrDataOrSelector,
                    data: data,
                },
            ];
        items = await this.updateOrderItemWithSelector_(toUpdate, sharedContext);
        return await this.baseRepository_.serialize(items, {
            populate: true,
        });
    }
    async updateOrderItem_(orderItemId, data, sharedContext = {}) {
        const [detail] = await this.orderItemService_.update([{ id: orderItemId, ...data }], sharedContext);
        return detail;
    }
    async updateOrderItemWithSelector_(updates, sharedContext = {}) {
        let toUpdate = [];
        for (const { selector, data } of updates) {
            const details = await this.listOrderItems({ ...selector }, {}, sharedContext);
            details.forEach((detail) => {
                toUpdate.push({
                    ...data,
                    id: detail.id,
                });
            });
        }
        return await this.orderItemService_.update(toUpdate, sharedContext);
    }
    async createAddresses(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const addresses = await this.createAddresses_(input, sharedContext);
        const result = await this.listAddresses({ id: addresses.map((p) => p.id) }, {}, sharedContext);
        return (Array.isArray(data) ? result : result[0]);
    }
    async createAddresses_(data, sharedContext = {}) {
        return await this.addressService_.create(data, sharedContext);
    }
    async updateAddresses(data, sharedContext = {}) {
        const input = Array.isArray(data) ? data : [data];
        const addresses = await this.updateAddresses_(input, sharedContext);
        const result = await this.listAddresses({ id: addresses.map((p) => p.id) }, {}, sharedContext);
        return (Array.isArray(data) ? result : result[0]);
    }
    async updateAddresses_(data, sharedContext = {}) {
        return await this.addressService_.update(data, sharedContext);
    }
    async createShippingMethods(orderIdOrData, data, sharedContext = {}) {
        let methods;
        if ((0, utils_1.isString)(orderIdOrData)) {
            methods = await this.createShippingMethods_(orderIdOrData, data, sharedContext);
        }
        else {
            const data = Array.isArray(orderIdOrData)
                ? orderIdOrData
                : [orderIdOrData];
            const allOrderIds = data.map((dt) => dt.order_id);
            const order = await this.list({ id: allOrderIds }, { select: ["id", "version"] }, sharedContext);
            const mapOrderVersion = order.reduce((acc, curr) => {
                acc[curr.id] = curr.version;
                return acc;
            }, {});
            const orderShippingMethodData = data.map((dt) => {
                return {
                    shipping_method: dt,
                    order_id: dt.order_id,
                    version: mapOrderVersion[dt.order_id],
                };
            });
            methods = await this.createShippingMethodsBulk_(orderShippingMethodData, sharedContext);
        }
        return await this.baseRepository_.serialize(methods, { populate: true });
    }
    async createShippingMethods_(orderId, data, sharedContext = {}) {
        const order = await this.retrieve(orderId, { select: ["id", "version"] }, sharedContext);
        const methods = data.map((method) => {
            return {
                shipping_method: method,
                order_id: order.id,
                version: method.version ?? order.version ?? 1,
            };
        });
        return await this.createShippingMethodsBulk_(methods, sharedContext);
    }
    async createShippingMethodsBulk_(data, sharedContext = {}) {
        const sm = await this.orderShippingMethodService_.create(data, sharedContext);
        return sm.map((s) => s.shipping_method);
    }
    async createLineItemAdjustments(orderIdOrData, adjustments, sharedContext = {}) {
        let addedAdjustments = [];
        if ((0, utils_1.isString)(orderIdOrData)) {
            const order = await this.retrieve(orderIdOrData, { select: ["id"], relations: ["items.item"] }, sharedContext);
            const lineIds = order.items?.map((item) => item.id);
            for (const adj of adjustments || []) {
                if (!lineIds?.includes(adj.item_id)) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Line item with id ${adj.item_id} does not exist on order with id ${orderIdOrData}`);
                }
            }
            addedAdjustments = await this.lineItemAdjustmentService_.create(adjustments, sharedContext);
        }
        else {
            const data = Array.isArray(orderIdOrData)
                ? orderIdOrData
                : [orderIdOrData];
            addedAdjustments = await this.lineItemAdjustmentService_.create(data, sharedContext);
        }
        return await this.baseRepository_.serialize(addedAdjustments, {
            populate: true,
        });
    }
    async setLineItemAdjustments(orderId, adjustments, sharedContext = {}) {
        const order = await this.retrieve(orderId, { select: ["id"], relations: ["items.item.adjustments"] }, sharedContext);
        const existingAdjustments = (order.items ?? [])
            .map((item) => item.adjustments ?? [])
            .flat()
            .map((adjustment) => adjustment.id);
        const adjustmentsSet = new Set(adjustments
            .map((a) => a.id)
            .filter(Boolean));
        const toDelete = [];
        // From the existing adjustments, find the ones that are not passed in adjustments
        existingAdjustments.forEach((adj) => {
            if (!adjustmentsSet.has(adj)) {
                toDelete.push(adj);
            }
        });
        if (toDelete.length) {
            await this.lineItemAdjustmentService_.delete(toDelete, sharedContext);
        }
        let result = await this.lineItemAdjustmentService_.upsert(adjustments, sharedContext);
        return await this.baseRepository_.serialize(result, {
            populate: true,
        });
    }
    async setShippingMethodAdjustments(orderId, adjustments, sharedContext = {}) {
        const order = await this.retrieve(orderId, { select: ["id"], relations: ["shipping_methods.adjustments"] }, sharedContext);
        const existingAdjustments = (order.shipping_methods ?? [])
            .map((shippingMethod) => shippingMethod.adjustments ?? [])
            .flat()
            .map((adjustment) => adjustment.id);
        const adjustmentsSet = new Set(adjustments
            .map((a) => a?.id)
            .filter(Boolean));
        const toDelete = [];
        // From the existing adjustments, find the ones that are not passed in adjustments
        existingAdjustments.forEach((adj) => {
            if (!adjustmentsSet.has(adj)) {
                toDelete.push(adj);
            }
        });
        if (toDelete.length) {
            await this.shippingMethodAdjustmentService_.delete(toDelete, sharedContext);
        }
        const result = await this.shippingMethodAdjustmentService_.upsert(adjustments, sharedContext);
        return await this.baseRepository_.serialize(result, {
            populate: true,
        });
    }
    async createShippingMethodAdjustments(orderIdOrData, adjustments, sharedContext = {}) {
        let addedAdjustments = [];
        if ((0, utils_1.isString)(orderIdOrData)) {
            const order = await this.retrieve(orderIdOrData, { select: ["id"], relations: ["shipping_methods"] }, sharedContext);
            const methodIds = order.shipping_methods?.map((method) => method.id);
            for (const adj of adjustments || []) {
                if (!methodIds?.includes(adj.shipping_method_id)) {
                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Shipping method with id ${adj.shipping_method_id} does not exist on order with id ${orderIdOrData}`);
                }
            }
            addedAdjustments = await this.shippingMethodAdjustmentService_.create(adjustments, sharedContext);
        }
        else {
            const data = Array.isArray(orderIdOrData)
                ? orderIdOrData
                : [orderIdOrData];
            addedAdjustments = await this.shippingMethodAdjustmentService_.create(data, sharedContext);
        }
        if ((0, utils_1.isObject)(orderIdOrData)) {
            return await this.baseRepository_.serialize(addedAdjustments[0], {
                populate: true,
            });
        }
        return await this.baseRepository_.serialize(addedAdjustments, {
            populate: true,
        });
    }
    async createLineItemTaxLines(orderIdOrData, taxLines, sharedContext = {}) {
        let addedTaxLines;
        if ((0, utils_1.isString)(orderIdOrData)) {
            const lines = Array.isArray(taxLines) ? taxLines : [taxLines];
            addedTaxLines = await this.lineItemTaxLineService_.create(lines, sharedContext);
        }
        else {
            const data = Array.isArray(orderIdOrData)
                ? orderIdOrData
                : [orderIdOrData];
            addedTaxLines = await this.lineItemTaxLineService_.create(data, sharedContext);
        }
        const serialized = await this.baseRepository_.serialize(addedTaxLines, {
            populate: true,
        });
        if ((0, utils_1.isObject)(orderIdOrData)) {
            return serialized[0];
        }
        return serialized;
    }
    async setLineItemTaxLines(orderId, taxLines, sharedContext = {}) {
        const order = await this.retrieve(orderId, { select: ["id"], relations: ["items.item.tax_lines"] }, sharedContext);
        const existingTaxLines = (order.items ?? [])
            .map((item) => item.tax_lines ?? [])
            .flat()
            .map((taxLine) => taxLine.id);
        const taxLinesSet = new Set(taxLines
            .map((taxLine) => taxLine?.id)
            .filter(Boolean));
        const toDelete = [];
        existingTaxLines.forEach((taxLine) => {
            if (!taxLinesSet.has(taxLine)) {
                toDelete.push(taxLine);
            }
        });
        if (toDelete.length) {
            await this.lineItemTaxLineService_.delete(toDelete, sharedContext);
        }
        const result = await this.lineItemTaxLineService_.upsert(taxLines, sharedContext);
        return await this.baseRepository_.serialize(result, {
            populate: true,
        });
    }
    async createShippingMethodTaxLines(orderIdOrData, taxLines, sharedContext = {}) {
        let addedTaxLines;
        if ((0, utils_1.isString)(orderIdOrData)) {
            const lines = Array.isArray(taxLines) ? taxLines : [taxLines];
            addedTaxLines = await this.shippingMethodTaxLineService_.create(lines, sharedContext);
        }
        else {
            addedTaxLines = await this.shippingMethodTaxLineService_.create(taxLines, sharedContext);
        }
        const serialized = await this.baseRepository_.serialize(addedTaxLines[0], {
            populate: true,
        });
        if ((0, utils_1.isObject)(orderIdOrData)) {
            return serialized[0];
        }
        return serialized;
    }
    async setShippingMethodTaxLines(orderId, taxLines, sharedContext = {}) {
        const order = await this.retrieve(orderId, { select: ["id"], relations: ["shipping_methods.tax_lines"] }, sharedContext);
        const existingTaxLines = (order.shipping_methods ?? [])
            .map((shippingMethod) => shippingMethod.tax_lines ?? [])
            .flat()
            .map((taxLine) => taxLine.id);
        const taxLinesSet = new Set(taxLines
            .map((taxLine) => taxLine?.id)
            .filter(Boolean));
        const toDelete = [];
        existingTaxLines.forEach((taxLine) => {
            if (!taxLinesSet.has(taxLine)) {
                toDelete.push(taxLine);
            }
        });
        if (toDelete.length) {
            await this.shippingMethodTaxLineService_.delete(toDelete, sharedContext);
        }
        const result = await this.shippingMethodTaxLineService_.upsert(taxLines, sharedContext);
        return await this.baseRepository_.serialize(result, {
            populate: true,
        });
    }
    async createOrderChange(data, sharedContext) {
        const changes = await this.createOrderChange_(data, sharedContext);
        return await this.baseRepository_.serialize(Array.isArray(data) ? changes : changes[0], {
            populate: true,
        });
    }
    async createOrderChange_(data, sharedContext) {
        const dataArr = Array.isArray(data) ? data : [data];
        const orderIds = [];
        const dataMap = {};
        for (const change of dataArr) {
            orderIds.push(change.order_id);
            dataMap[change.order_id] = change;
        }
        const orders = await this.list({
            id: orderIds,
        }, {
            select: ["id", "version"],
        }, sharedContext);
        if (orders.length !== orderIds.length) {
            const foundOrders = orders.map((o) => o.id);
            const missing = orderIds.filter((id) => !foundOrders.includes(id));
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Order could not be found: ${missing.join(", ")}`);
        }
        const input = orders.map((order) => {
            return {
                ...dataMap[order.id],
                version: order.version + 1,
            };
        });
        return await this.orderChangeService_.create(input, sharedContext);
    }
    async cancelOrderChange(orderChangeIdOrData, sharedContext) {
        const data = Array.isArray(orderChangeIdOrData)
            ? orderChangeIdOrData
            : [orderChangeIdOrData];
        const orderChangeIds = (0, utils_1.isString)(data[0])
            ? data
            : data.map((dt) => dt.id);
        await this.getAndValidateOrderChange_(orderChangeIds, false, sharedContext);
        const updates = data.map((dt) => {
            return {
                ...((0, utils_1.isString)(dt) ? { id: dt } : dt),
                canceled_at: new Date(),
                status: utils_1.OrderChangeStatus.CANCELED,
            };
        });
        await this.orderChangeService_.update(updates, sharedContext);
    }
    async confirmOrderChange(orderChangeIdOrData, sharedContext) {
        const data = Array.isArray(orderChangeIdOrData)
            ? orderChangeIdOrData
            : [orderChangeIdOrData];
        const orderChangeIds = (0, utils_1.isString)(data[0])
            ? data
            : data.map((dt) => dt.id);
        const orderChange = await this.getAndValidateOrderChange_(orderChangeIds, true, sharedContext);
        const updates = data.map((dt) => {
            return {
                ...((0, utils_1.isString)(dt) ? { id: dt } : dt),
                confirmed_at: new Date(),
                status: utils_1.OrderChangeStatus.CONFIRMED,
            };
        });
        await this.orderChangeService_.update(updates, sharedContext);
        const orderChanges = orderChange.map((change) => {
            change.actions = change.actions.map((action) => {
                return {
                    ...action,
                    version: change.version,
                    order_id: change.order_id,
                };
            });
            return change.actions;
        });
        await this.applyOrderChanges_(orderChanges.flat(), sharedContext);
    }
    async declineOrderChange(orderChangeIdOrData, sharedContext) {
        const data = Array.isArray(orderChangeIdOrData)
            ? orderChangeIdOrData
            : [orderChangeIdOrData];
        const orderChangeIds = (0, utils_1.isString)(data[0])
            ? data
            : data.map((dt) => dt.id);
        await this.getAndValidateOrderChange_(orderChangeIds, false, sharedContext);
        const updates = data.map((dt) => {
            return {
                ...((0, utils_1.isString)(dt) ? { id: dt } : dt),
                declined_at: new Date(),
                status: utils_1.OrderChangeStatus.DECLINED,
            };
        });
        await this.orderChangeService_.update(updates, sharedContext);
    }
    async applyPendingOrderActions(orderId, sharedContext) {
        const orderIds = Array.isArray(orderId) ? orderId : [orderId];
        const orders = await this.list({ id: orderIds }, {
            select: ["id", "version"],
        }, sharedContext);
        const changes = await this.orderChangeActionService_.list({
            order_id: orders.map((order) => order.id),
            version: orders[0].version,
            applied: false,
        }, {
            select: [
                "id",
                "order_id",
                "ordering",
                "version",
                "applied",
                "reference",
                "reference_id",
                "action",
                "details",
                "amount",
                "raw_amount",
                "internal_note",
            ],
            order: {
                ordering: "ASC",
            },
        }, sharedContext);
        await this.applyOrderChanges_(changes, sharedContext);
    }
    async revertLastVersion(orderId, sharedContext) {
        const order = await super.retrieve(orderId, {
            select: ["id", "version"],
        }, sharedContext);
        if (order.version < 2) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Order with id ${orderId} has no previous versions`);
        }
        return await this.revertLastChange_(order, sharedContext);
    }
    async revertLastChange_(order, sharedContext) {
        const currentVersion = order.version;
        // Order Changes
        const orderChanges = await this.orderChangeService_.list({
            order_id: order.id,
            version: currentVersion,
        }, { select: ["id", "version"] }, sharedContext);
        const orderChangesIds = orderChanges.map((change) => change.id);
        await this.orderChangeService_.softDelete(orderChangesIds, sharedContext);
        // Order Changes Actions
        const orderChangesActions = await this.orderChangeActionService_.list({
            order_id: order.id,
            version: currentVersion,
        }, { select: ["id", "version"] }, sharedContext);
        const orderChangeActionsIds = orderChangesActions.map((action) => action.id);
        await this.orderChangeActionService_.softDelete(orderChangeActionsIds, sharedContext);
        // Order Summary
        const orderSummary = await this.orderSummaryService_.list({
            order_id: order.id,
            version: currentVersion,
        }, { select: ["id", "version"] }, sharedContext);
        const orderSummaryIds = orderSummary.map((summary) => summary.id);
        await this.orderSummaryService_.softDelete(orderSummaryIds, sharedContext);
        // Order Items
        const orderItems = await this.orderItemService_.list({
            order_id: order.id,
            version: currentVersion,
        }, { select: ["id", "version"] }, sharedContext);
        const orderItemIds = orderItems.map((summary) => summary.id);
        await this.orderItemService_.softDelete(orderItemIds, sharedContext);
        // Shipping Methods
        const orderShippingMethods = await this.orderShippingMethodService_.list({
            order_id: order.id,
            version: currentVersion,
        }, { select: ["id", "version"] }, sharedContext);
        const orderShippingMethodIds = orderShippingMethods.map((summary) => summary.id);
        await this.orderShippingMethodService_.softDelete(orderShippingMethodIds, sharedContext);
        // Order
        await this.orderService_.update({
            selector: {
                id: order.id,
            },
            data: {
                version: order.version - 1,
            },
        }, sharedContext);
    }
    async getAndValidateOrderChange_(orderChangeIds, includeActions, sharedContext) {
        const options = {
            select: ["id", "order_id", "version", "status"],
            relations: [],
            order: {},
        };
        if (includeActions) {
            options.select.push("actions");
            options.relations.push("actions");
            options.order = {
                actions: {
                    ordering: "ASC",
                },
            };
        }
        const orderChanges = await this.listOrderChanges({
            id: orderChangeIds,
        }, options, sharedContext);
        if (orderChanges.length !== orderChangeIds.length) {
            const foundOrders = orderChanges.map((o) => o.id);
            const missing = orderChangeIds.filter((id) => !foundOrders.includes(id));
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Order Change could not be found: ${missing.join(", ")}`);
        }
        for (const orderChange of orderChanges) {
            const notAllowed = [];
            if (!(orderChange.status === utils_1.OrderChangeStatus.PENDING ||
                orderChange.status === utils_1.OrderChangeStatus.REQUESTED)) {
                notAllowed.push(orderChange.id);
            }
            if (notAllowed.length) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Order Change cannot be modified: ${notAllowed.join(", ")}.`);
            }
        }
        return orderChanges;
    }
    async addOrderAction(data, sharedContext) {
        let dataArr = Array.isArray(data) ? data : [data];
        const orderChangeMap = {};
        const orderChangeIds = dataArr
            .map((data, idx) => {
            var _a;
            if (data.order_change_id) {
                orderChangeMap[_a = data.order_change_id] ?? (orderChangeMap[_a] = []);
                orderChangeMap[data.order_change_id].push(dataArr[idx]);
            }
            return data.order_change_id;
        })
            .filter(Boolean);
        if (orderChangeIds.length) {
            const ordChanges = await this.getAndValidateOrderChange_(orderChangeIds, false, sharedContext);
            for (const ordChange of ordChanges) {
                orderChangeMap[ordChange.id].forEach((data) => {
                    if (data) {
                        data.order_id = ordChange.order_id;
                        data.version = ordChange.version;
                    }
                });
            }
        }
        const actions = (await this.orderChangeActionService_.create(dataArr, sharedContext));
        return Array.isArray(data) ? actions : actions[0];
    }
    async applyOrderChanges_(changeActions, sharedContext) {
        var _a;
        const actionsMap = {};
        const ordersIds = [];
        const usedActions = [];
        for (const action of changeActions) {
            if (action.applied) {
                continue;
            }
            ordersIds.push(action.order_id);
            actionsMap[_a = action.order_id] ?? (actionsMap[_a] = []);
            actionsMap[action.order_id].push(action);
            usedActions.push({
                selector: {
                    id: action.id,
                },
                data: {
                    applied: true,
                },
            });
        }
        if (!ordersIds.length) {
            return;
        }
        const orders = await this.list({ id: (0, utils_1.deduplicate)(ordersIds) }, {
            select: [
                "id",
                "version",
                "items.detail",
                "transactions",
                "summary",
                "total",
            ],
            relations: ["transactions", "items", "items.detail"],
        }, sharedContext);
        const itemsToUpsert = [];
        const shippingMethodsToInsert = [];
        const summariesToUpsert = [];
        const orderToUpdate = [];
        for (const order of orders) {
            const calculated = (0, utils_2.calculateOrderChange)({
                order: order,
                actions: actionsMap[order.id],
                transactions: order.transactions,
            });
            (0, utils_1.createRawPropertiesFromBigNumber)(calculated);
            const version = actionsMap[order.id][0].version;
            for (const item of calculated.order.items) {
                const orderItem = item.detail;
                itemsToUpsert.push({
                    id: orderItem.version === version ? orderItem.id : undefined,
                    item_id: item.id,
                    order_id: order.id,
                    version,
                    quantity: item.detail.quantity,
                    fulfilled_quantity: item.detail.fulfilled_quantity,
                    shipped_quantity: item.detail.shipped_quantity,
                    return_requested_quantity: item.detail.return_requested_quantity,
                    return_received_quantity: item.detail.return_received_quantity,
                    return_dismissed_quantity: item.detail.return_dismissed_quantity,
                    written_off_quantity: item.detail.written_off_quantity,
                    metadata: item.detail.metadata,
                });
            }
            const orderSummary = order.summary;
            summariesToUpsert.push({
                id: orderSummary.version === version ? orderSummary.id : undefined,
                order_id: order.id,
                version,
                totals: calculated.summary,
            });
            if (version > order.version) {
                for (const shippingMethod of order.shipping_methods ?? []) {
                    const sm = {
                        ...shippingMethod.detail,
                        version,
                    };
                    delete sm.id;
                    shippingMethodsToInsert.push(sm);
                }
                orderToUpdate.push({
                    selector: {
                        id: order.id,
                    },
                    data: {
                        version,
                    },
                });
            }
        }
        await (0, utils_1.promiseAll)([
            orderToUpdate.length
                ? this.orderService_.update(orderToUpdate, sharedContext)
                : null,
            usedActions.length
                ? this.orderChangeActionService_.update(usedActions, sharedContext)
                : null,
            itemsToUpsert.length
                ? this.orderItemService_.upsert(itemsToUpsert, sharedContext)
                : null,
            summariesToUpsert.length
                ? this.orderSummaryService_.upsert(summariesToUpsert, sharedContext)
                : null,
            shippingMethodsToInsert.length
                ? this.orderShippingMethodService_.create(shippingMethodsToInsert, sharedContext)
                : null,
        ]);
    }
    async registerFulfillment(data, sharedContext) {
        const items = data.items.map((item) => {
            return {
                action: utils_2.ChangeActionType.FULFILL_ITEM,
                internal_note: item.internal_note,
                reference: data.reference,
                reference_id: data.reference_id,
                details: {
                    reference_id: item.id,
                    quantity: item.quantity,
                    metadata: item.metadata,
                },
            };
        });
        const change = await this.createOrderChange_({
            order_id: data.order_id,
            description: data.description,
            internal_note: data.internal_note,
            created_by: data.created_by,
            metadata: data.metadata,
            actions: items,
        }, sharedContext);
        await this.confirmOrderChange(change[0].id, sharedContext);
    }
    async registerShipment(data, sharedContext) {
        let shippingMethodId;
        if (!(0, utils_1.isString)(data.shipping_method)) {
            const methods = await this.createShippingMethods(data.order_id, data.shipping_method, sharedContext);
            shippingMethodId = methods[0].id;
        }
        else {
            shippingMethodId = data.shipping_method;
        }
        const method = await this.shippingMethodService_.retrieve(shippingMethodId, {
            relations: ["tax_lines", "adjustments"],
        }, sharedContext);
        const calculatedAmount = (0, utils_1.getShippingMethodsTotals)([method], {})[method.id];
        const actions = data.items.map((item) => {
            return {
                action: utils_2.ChangeActionType.SHIP_ITEM,
                internal_note: item.internal_note,
                reference: data.reference,
                reference_id: shippingMethodId,
                details: {
                    reference_id: item.id,
                    quantity: item.quantity,
                    metadata: item.metadata,
                },
            };
        });
        if (shippingMethodId) {
            actions.push({
                action: utils_2.ChangeActionType.SHIPPING_ADD,
                reference: data.reference,
                reference_id: shippingMethodId,
                amount: calculatedAmount.total,
            });
        }
        const change = await this.createOrderChange_({
            order_id: data.order_id,
            description: data.description,
            internal_note: data.internal_note,
            created_by: data.created_by,
            metadata: data.metadata,
            actions,
        }, sharedContext);
        await this.confirmOrderChange(change[0].id, sharedContext);
    }
    async createReturn(data, sharedContext) {
        let shippingMethodId;
        if (!(0, utils_1.isString)(data.shipping_method)) {
            const methods = await this.createShippingMethods(data.order_id, data.shipping_method, sharedContext);
            shippingMethodId = methods[0].id;
        }
        else {
            shippingMethodId = data.shipping_method;
        }
        const method = await this.shippingMethodService_.retrieve(shippingMethodId, {
            relations: ["tax_lines", "adjustments"],
        }, sharedContext);
        const calculatedAmount = (0, utils_1.getShippingMethodsTotals)([method], {})[method.id];
        const actions = data.items.map((item) => {
            return {
                action: utils_2.ChangeActionType.RETURN_ITEM,
                internal_note: item.internal_note,
                reference: data.reference,
                reference_id: shippingMethodId,
                details: {
                    reference_id: item.id,
                    quantity: item.quantity,
                    metadata: item.metadata,
                },
            };
        });
        if (shippingMethodId) {
            actions.push({
                action: utils_2.ChangeActionType.SHIPPING_ADD,
                reference: data.reference,
                reference_id: shippingMethodId,
                amount: calculatedAmount.total,
            });
        }
        const change = await this.createOrderChange_({
            order_id: data.order_id,
            description: data.description,
            internal_note: data.internal_note,
            created_by: data.created_by,
            metadata: data.metadata,
            actions,
        }, sharedContext);
        await this.confirmOrderChange(change[0].id, sharedContext);
    }
}
exports.default = OrderModuleService;
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "create", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "create_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "update", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "update_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createLineItems", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createLineItems_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createLineItemsBulk_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "updateLineItems", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "updateLineItem_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "updateLineItemsWithSelector_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "updateOrderItem", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "updateOrderItem_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "updateOrderItemWithSelector_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createAddresses", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createAddresses_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "updateAddresses", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "updateAddresses_", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createShippingMethods", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createShippingMethods_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(1, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createShippingMethodsBulk_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createLineItemAdjustments", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "setLineItemAdjustments", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "setShippingMethodAdjustments", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createShippingMethodAdjustments", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createLineItemTaxLines", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "setLineItemTaxLines", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createShippingMethodTaxLines", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __param(2, (0, utils_1.MedusaContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "setShippingMethodTaxLines", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createOrderChange", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createOrderChange_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "cancelOrderChange", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "confirmOrderChange", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "declineOrderChange", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "applyPendingOrderActions", null);
__decorate([
    (0, utils_1.InjectManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "revertLastVersion", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "revertLastChange_", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "addOrderAction", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "registerFulfillment", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "registerShipment", null);
__decorate([
    (0, utils_1.InjectTransactionManager)("baseRepository_"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderModuleService.prototype, "createReturn", null);
//# sourceMappingURL=order-module-service.js.map