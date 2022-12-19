import { asClass, asValue, createContainer } from "awilix"
import { MockManager, MockRepository } from "medusa-test-utils"
import PaymentProviderService from "../payment-provider";
import { PaymentProviderServiceMock } from "../__mocks__/payment-provider";
import { CustomerServiceMock } from "../__mocks__/customer";
import { FlagRouter } from "../../utils/flag-router";
import Logger from "../../loaders/logger";

export const defaultContainer = createContainer()
defaultContainer.register("paymentProviderService", asClass(PaymentProviderService))
defaultContainer.register("manager", asValue(MockManager))
defaultContainer.register("paymentSessionRepository", asValue(MockRepository()))
defaultContainer.register("paymentProviderRepository", asValue(PaymentProviderServiceMock))
defaultContainer.register("paymentRepository", asValue(MockRepository()))
defaultContainer.register("refundRepository", asValue(MockRepository()))
defaultContainer.register("customerService", asValue(CustomerServiceMock))
defaultContainer.register("featureFlagRouter", asValue(new FlagRouter({})))
defaultContainer.register("logger", asValue(Logger))
