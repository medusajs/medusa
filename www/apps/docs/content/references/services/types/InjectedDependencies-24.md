# InjectedDependencies

 **InjectedDependencies**: { `customerService`: [`CustomerService`](../classes/CustomerService.md) ; `featureFlagRouter`: [`FlagRouter`](../classes/FlagRouter.md) ; `logger`: [`Logger`](Logger-2.md) ; `manager`: [`EntityManager`](../classes/EntityManager.md) ; `paymentProviderRepository`: typeof [`PaymentProviderRepository`](../index.md#paymentproviderrepository) ; `paymentRepository`: typeof [`PaymentRepository`](../index.md#paymentrepository) ; `paymentService`: [`PaymentService`](../classes/PaymentService.md) ; `paymentSessionRepository`: typeof [`PaymentSessionRepository`](../index.md#paymentsessionrepository) ; `refundRepository`: typeof [`RefundRepository`](../index.md#refundrepository)  } & { [key in \`${PaymentProviderKey}\`]: AbstractPaymentService \| typeof "medusa-interfaces" }

#### Defined in

[packages/medusa/src/services/payment-provider.ts:35](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L35)
