import { Context, CreatePaymentProviderDTO, CreatePaymentProviderSession, DAL, FilterablePaymentProviderProps, FindConfig, InternalModuleDeclaration, IPaymentProvider, PaymentProviderDataInput, PaymentProviderDTO, PaymentProviderSessionResponse, PaymentSessionStatus, ProviderWebhookPayload, UpdatePaymentProviderSession, WebhookActionResult } from "@medusajs/types";
import { PaymentProvider } from "../models";
type InjectedDependencies = {
    paymentProviderRepository: DAL.RepositoryService;
    [key: `pp_${string}`]: IPaymentProvider;
};
export default class PaymentProviderService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected readonly container_: InjectedDependencies;
    protected readonly paymentProviderRepository_: DAL.RepositoryService;
    constructor(container: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    create(data: CreatePaymentProviderDTO[], sharedContext?: Context): Promise<PaymentProvider[]>;
    list(filters: FilterablePaymentProviderProps, config: FindConfig<PaymentProviderDTO>, sharedContext?: Context): Promise<PaymentProvider[]>;
    listAndCount(filters: FilterablePaymentProviderProps, config: FindConfig<PaymentProviderDTO>, sharedContext?: Context): Promise<[PaymentProvider[], number]>;
    retrieveProvider(providerId: string): IPaymentProvider;
    createSession(providerId: string, sessionInput: CreatePaymentProviderSession): Promise<PaymentProviderSessionResponse["data"]>;
    updateSession(providerId: string, sessionInput: UpdatePaymentProviderSession): Promise<Record<string, unknown> | undefined>;
    deleteSession(input: PaymentProviderDataInput): Promise<void>;
    authorizePayment(input: PaymentProviderDataInput, context: Record<string, unknown>): Promise<{
        data: Record<string, unknown>;
        status: PaymentSessionStatus;
    }>;
    getStatus(input: PaymentProviderDataInput): Promise<PaymentSessionStatus>;
    capturePayment(input: PaymentProviderDataInput): Promise<Record<string, unknown>>;
    cancelPayment(input: PaymentProviderDataInput): Promise<void>;
    refundPayment(input: PaymentProviderDataInput, amount: number): Promise<Record<string, unknown>>;
    getWebhookActionAndData(providerId: string, data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult>;
    private throwPaymentProviderError;
}
export {};
