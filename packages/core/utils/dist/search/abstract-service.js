"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSearchService = void 0;
/**
 * ## Overview
 *
 * A search service class is in a TypeScript or JavaScript file created in the `src/services` directory. The class must extend the `AbstractSearchService` class imported
 *  from the `@medusajs/utils` package.
 *
 * Based on services’ naming conventions, the file’s name should be the slug version of the search service’s name without `service`, and the class’s name should be the
 * pascal case of the search service’s name following by `Service`.
 *
 * For example, create the `MySearchService` class in the file `src/services/my-search.ts`:
 *
 * ```ts title="src/services/my-search.ts"
 * import { AbstractSearchService } from "@medusajs/utils"
 *
 * class MySearchService extends AbstractSearchService {
 *   isDefault = false
 *
 *   createIndex(indexName: string, options: Record<string, any>) {
 *     throw new Error("Method not implemented.")
 *   }
 *   getIndex(indexName: string) {
 *     throw new Error("Method not implemented.")
 *   }
 *   addDocuments(
 *     indexName: string,
 *     documents: Record<string, any>[],
 *     type: string
 *   ) {
 *     throw new Error("Method not implemented.")
 *   }
 *   replaceDocuments(
 *     indexName: string,
 *     documents: Record<string, any>[],
 *     type: string
 *   ) {
 *     throw new Error("Method not implemented.")
 *   }
 *   deleteDocument(
 *     indexName: string,
 *     document_id: string | number
 *   ) {
 *     throw new Error("Method not implemented.")
 *   }
 *   deleteAllDocuments(indexName: string) {
 *     throw new Error("Method not implemented.")
 *   }
 *   search(
 *     indexName: string,
 *     query: string,
 *     options: Record<string, any>
 *   ) {
 *     return {
 *       message: "test",
 *     }
 *   }
 *   updateSettings(
 *     indexName: string,
 *     settings: Record<string, any>
 *   ) {
 *     throw new Error("Method not implemented.")
 *   }
 *
 * }
 *
 * export default MySearchService
 * ```
 *
 * ---
 *
 * ## Notes About Class Methods
 *
 * Although there are several helper methods in this class, the main methods used by the Medusa backend are `addDocuments`, `deleteDocument`, and `search`.
 * The rest of the methods are provided in case you need them for custom use cases.
 *
 * ---
 */
var AbstractSearchService = /** @class */ (function () {
    /**
     * You can use the `constructor` of your search service to access the different services in Medusa through dependency injection.
     *
     * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs,
     * you can initialize it in the constructor and use it in other methods in the service.
     *
     * Additionally, if you’re creating your search service as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin,
     * you can access them in the constructor. The default constructor already sets the value of the class proeprty `options_` to the passed options.
     *
     * @param {MedusaContainer} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend.
     * @param {Record<string, unknown>} options - If this search service is created in a plugin, the plugin's options are passed in this parameter.
     *
     * @example
     * // ...
     * import { ProductService } from "@medusajs/medusa"
     *
     * type InjectedDependencies = {
     *   productService: ProductService
     * }
     *
     * class MySearchService extends AbstractSearchService {
     *   // ...
     *   protected readonly productService_: ProductService
     *
     *   constructor({ productService }: InjectedDependencies) {
     *     // @ts-expect-error prefer-rest-params
     *     super(...arguments)
     *     this.productService_ = productService
     *
     *     // you can also initialize a client that
     *     // communicates with a third-party service.
     *     this.client = new Client(options)
     *   }
     *
     *   // ...
     * }
     */
    function AbstractSearchService(container, options) {
        this.options_ = options;
    }
    /**
     * @ignore
     */
    AbstractSearchService.isSearchService = function (obj) {
        var _a;
        return (_a = obj === null || obj === void 0 ? void 0 : obj.constructor) === null || _a === void 0 ? void 0 : _a._isSearchService;
    };
    Object.defineProperty(AbstractSearchService.prototype, "options", {
        /**
         * @ignore
         */
        get: function () {
            return this.options_;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @ignore
     */
    AbstractSearchService._isSearchService = true;
    return AbstractSearchService;
}());
exports.AbstractSearchService = AbstractSearchService;
//# sourceMappingURL=abstract-service.js.map