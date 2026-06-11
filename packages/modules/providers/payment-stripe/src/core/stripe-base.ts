abstract class StripeBase extends AbstractPaymentProvider<StripeOptions> {
  // ...

  static validateOptions(options: StripeOptions): void {
    if (!isDefined(options.apiKey)) {
      throw new Error("Required option `apiKey` is missing in Stripe plugin")
    }
+   if (!isDefined(options.webhookSecret)) {
+     throw new Error("Required option `webhookSecret` is missing in Stripe plugin")
+   }
  }

  // ...
}