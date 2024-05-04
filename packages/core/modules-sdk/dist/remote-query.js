"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteQuery = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const utils_1 = require("@medusajs/utils");
const medusa_module_1 = require("./medusa-module");
class RemoteQuery {
    constructor({ modulesLoaded, customRemoteFetchData, servicesConfig = [], }) {
        this.modulesMap = new Map();
        const servicesConfig_ = [...servicesConfig];
        if (!modulesLoaded?.length) {
            modulesLoaded = medusa_module_1.MedusaModule.getLoadedModules().map((mod) => Object.values(mod)[0]);
        }
        for (const mod of modulesLoaded) {
            if (!mod.__definition.isQueryable) {
                continue;
            }
            const serviceName = mod.__definition.key;
            if (this.modulesMap.has(serviceName)) {
                throw new Error(`Duplicated instance of module ${serviceName} is not allowed.`);
            }
            this.modulesMap.set(serviceName, mod);
            servicesConfig_.push(mod.__joinerConfig);
        }
        this.customRemoteFetchData = customRemoteFetchData;
        this.remoteJoiner = new orchestration_1.RemoteJoiner(servicesConfig_, this.remoteFetchData.bind(this), { autoCreateServiceNameAlias: false });
    }
    setFetchDataCallback(remoteFetchData) {
        this.remoteJoiner.setFetchDataCallback(remoteFetchData);
    }
    static getAllFieldsAndRelations(expand, prefix = "", args = {}) {
        expand = JSON.parse(JSON.stringify(expand));
        let fields = new Set();
        let relations = [];
        let shouldSelectAll = false;
        for (const field of expand.fields ?? []) {
            if (field === "*") {
                shouldSelectAll = true;
                break;
            }
            fields.add(prefix ? `${prefix}.${field}` : field);
        }
        args[prefix] = expand.args;
        for (const property in expand.expands ?? {}) {
            const newPrefix = prefix ? `${prefix}.${property}` : property;
            relations.push(newPrefix);
            fields.delete(newPrefix);
            const result = RemoteQuery.getAllFieldsAndRelations(expand.expands[property], newPrefix, args);
            result.select?.forEach(fields.add, fields);
            relations = relations.concat(result.relations);
        }
        const allFields = Array.from(fields);
        const select = allFields.length && !shouldSelectAll
            ? allFields
            : shouldSelectAll
                ? undefined
                : [];
        return { select, relations, args };
    }
    hasPagination(options) {
        if (!options) {
            return false;
        }
        const attrs = ["skip", "cursor"];
        return Object.keys(options).some((key) => attrs.includes(key));
    }
    buildPagination(options, count) {
        return {
            skip: options.skip,
            take: options.take,
            cursor: options.cursor,
            // TODO: next cursor
            count,
        };
    }
    async remoteFetchData(expand, keyField, ids, relationship) {
        if (this.customRemoteFetchData) {
            const resp = await this.customRemoteFetchData(expand, keyField, ids);
            if (resp !== undefined) {
                return resp;
            }
        }
        const serviceConfig = expand.serviceConfig;
        const service = this.modulesMap.get(serviceConfig.serviceName);
        let filters = {};
        const options = {
            ...RemoteQuery.getAllFieldsAndRelations(expand),
        };
        const availableOptions = [
            "skip",
            "take",
            "limit",
            "offset",
            "cursor",
            "sort",
            "order",
            "withDeleted",
        ];
        const availableOptionsAlias = new Map([
            ["limit", "take"],
            ["offset", "skip"],
        ]);
        for (const arg of expand.args || []) {
            if (arg.name === "filters" && arg.value) {
                filters = { ...filters, ...arg.value };
            }
            else if (arg.name === "context" && arg.value) {
                filters["context"] = arg.value;
            }
            else if (availableOptions.includes(arg.name)) {
                const argName = availableOptionsAlias.has(arg.name)
                    ? availableOptionsAlias.get(arg.name)
                    : arg.name;
                options[argName] = arg.value;
            }
        }
        if (ids) {
            filters[keyField] = ids;
        }
        const hasPagination = this.hasPagination(options);
        let methodName = hasPagination ? "listAndCount" : "list";
        if (relationship?.args?.methodSuffix) {
            methodName += (0, utils_1.toPascalCase)(relationship.args.methodSuffix);
        }
        else if (serviceConfig?.args?.methodSuffix) {
            methodName += (0, utils_1.toPascalCase)(serviceConfig.args.methodSuffix);
        }
        if (typeof service[methodName] !== "function") {
            throw new Error(`Method "${methodName}" does not exist on "${serviceConfig.serviceName}"`);
        }
        const result = await service[methodName](filters, options);
        if (hasPagination) {
            const [data, count] = result;
            return {
                data: {
                    rows: data,
                    metadata: this.buildPagination(options, count),
                },
                path: "rows",
            };
        }
        return {
            data: result,
        };
    }
    async query(query, variables, options) {
        let finalQuery = query;
        if ((0, utils_1.isString)(query)) {
            finalQuery = orchestration_1.RemoteJoiner.parseQuery(query, variables);
        }
        else if (!(0, utils_1.isString)(finalQuery?.service) && !(0, utils_1.isString)(finalQuery?.alias)) {
            finalQuery = (0, orchestration_1.toRemoteJoinerQuery)(query, variables);
        }
        return await this.remoteJoiner.query(finalQuery, options);
    }
}
exports.RemoteQuery = RemoteQuery;
//# sourceMappingURL=remote-query.js.map