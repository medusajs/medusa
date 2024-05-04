"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPaymentProviderError = exports.AbstractPaymentProvider = void 0;
/**
 * ## Overview
 *
 * A payment provider is used to handle and process payments, such as authorizing, capturing, and refund payments.
 *
 * Refer to [this guide](https://docs.medusajs.com/experimental/payment/payment-provider/) to learn more about payment providers.
 *
 * Refer to [this guide](https://docs.medusajs.com/experimental/payment/payment-flow/) to learn more about the payment flow.
 *
 * ---
 *
 * ## How to Create a Payment Provider
 *
 * A payment provider is a TypeScript or JavaScript class that extends the `AbstractPaymentProvider` class imported from `@medusajsa/utils`.
 *
 * You can create the payment provider in a module or plugin, then pass that module/plugin in the Payment Module's `providers` option. You can also pass the path to the file
 * that defines the provider if it's created in the Medusa application's codebase.
 *
 * For example:
 *
 * ```ts
 * abstract class MyPayment extends AbstractPaymentProvider<MyConfigurations> {
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## Configuration Type Parameter
 *
 * The `AbstractPaymentProvider` class accepts an optional type parameter that defines the type of configuration that your payment provider expects.
 *
 * For example:
 *
 * ```ts
 * interface MyConfigurations {
 *   apiKey: string
 * }
 *
 * abstract class MyPayment extends AbstractPaymentProvider<MyConfigurations> {
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## Identifier Property
 *
 * The `PaymentProvider` data model has 2 properties: `id` and `is_enabled`.
 *
 * ```ts
 * class MyPaymentProvider extends AbstractPaymentProvider<MyConfigurations> {
 *   static identifier = "my-payment"
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## PROVIDER Property
 *
 * The `PROVIDER` static property is used when registering the provider in the dependency container. Typically, it would have the
 * same value as the `identifier` property.
 *
 * ```ts
 * class MyPaymentProvider extends AbstractPaymentProvider<MyConfigurations> {
 *   static PROVIDER = "my-payment"
 *   // ...
 * }
 * ```
 *
 * ---
 *
 * ## PaymentProviderError
 *
 * Before diving into the methods of the Payment Provider, you'll notice that part of the expected return signature of these method includes `PaymentProviderError`.
 *
 * ```ts
 * interface PaymentProviderError {
 *   error: string
 *   code?: string
 *   detail?: any
 * }
 * ```
 *
 * While implementing the Payment Provider's methods, if you need to inform the Payment Module that an error occurred at a certain stage,
 * return an object having the attributes defined in the `PaymentProviderError` interface.
 *
 * For example, the Stripe payment provider has the following method to create the error object, which is used within other methods:
 *
 * ```ts
 * abstract class StripeBase extends AbstractPaymentProvider {
 *   // ...
 *   protected buildError(
 *    message: string,
 *    error: Stripe.StripeRawError | PaymentProviderError | Error
 *  ): PaymentProviderError {
 *    return {
 *      error: message,
 *      code: "code" in error ? error.code : "unknown",
 *      detail: isPaymentProviderError(error)
 *        ? `${error.error}${EOL}${error.detail ?? ""}`
 *        : "detail" in error
 *        ? error.detail
 *        : error.message ?? "",
 *    }
 *  }
 *
 *   // used in other methods
 *   async retrievePayment(
 *     paymentSessionData: Record<string, unknown>
 *   ): Promise<
 *     PaymentProviderError |
 *     PaymentProviderSessionResponse["session_data"]
 *   > {
 *     try {
 *       // ...
 *     } catch (e) {
 *       return this.buildError(
 *         "An error occurred in retrievePayment",
 *         e
 *       )
 *     }
 *   }
 * }
 * ```
 *
 */
var AbstractPaymentProvider = /** @class */ (function () {
    /**
     * You can use the `constructor` of your Payment Provider to have access to resources in your application through the [dependency container](https://docs.medusajs.com/development/fundamentals/dependency-injection).
     *
     * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs,
     * you can initialize it in the constructor and use it in other methods in the service.
     *
     * The payment provider also can access the configurations of the module or plugin it's created in as a second parameter.
     *
     * @param {MedusaContainer} container - An instance of `MedusaContainer` that allows you to access other resources in the [dependency container](https://docs.medusajs.com/development/fundamentals/dependency-injection)
     * @param {Record<string, unknown>} config - If this provider processor is created in a module or plugin, their options are passed in this parameter.
     *
     * @example
     * ```ts
     * class MyPaymentProvider extends AbstractPaymentProvider<MyConfigurations> {
     *   // ...
     *   constructor(container, config) {
     *     super(container, config)
     *     // you can access options here
     *
     *     // you can also initialize a client that
     *     // communicates with a third-party service.
     *     this.client = new Client(options)
     *   }
     *   // ...
     * }
     * ```
     */
    function AbstractPaymentProvider(container, config // eslint-disable-next-line @typescript-eslint/no-empty-function
    ) {
        if (config === void 0) { config = {}; }
        this.container = container;
        this.config = config;
    }
    /**
     * @ignore
     */
    AbstractPaymentProvider.isPaymentProvider = function (object) {
        var _a;
        return (_a = object === null || object === void 0 ? void 0 : object.constructor) === null || _a === void 0 ? void 0 : _a._isPaymentProvider;
    };
    /**
     * @ignore
     *
     * Return a unique identifier to retrieve the payment plugin provider
     */
    AbstractPaymentProvider.prototype.getIdentifier = function () {
        var ctr = this.constructor;
        if (!ctr.identifier) {
            throw new Error("Missing static property \"identifier\".");
        }
        return ctr.identifier;
    };
    /**
     * @ignore
     */
    AbstractPaymentProvider._isPaymentProvider = true;
    return AbstractPaymentProvider;
}());
exports.AbstractPaymentProvider = AbstractPaymentProvider;
/**
 * @ignore
 */
function isPaymentProviderError(obj) {
    return (obj &&
        typeof obj === "object" &&
        "error" in obj &&
        "code" in obj &&
        "detail" in obj);
}
exports.isPaymentProviderError = isPaymentProviderError;
//# sourceMappingURL=abstract-payment-provider.js.map