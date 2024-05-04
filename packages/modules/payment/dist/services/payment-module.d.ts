import { CaptureDTO, Context, CreateCaptureDTO, CreatePaymentCollectionDTO, CreatePaymentSessionDTO, CreateRefundDTO, DAL, FilterablePaymentCollectionProps, FilterablePaymentProviderProps, FindConfig, InternalModuleDeclaration, IPaymentModuleService, ModuleJoinerConfig, ModulesSdkTypes, PaymentCollectionDTO, PaymentCollectionUpdatableFields, PaymentDTO, PaymentProviderDTO, PaymentSessionDTO, ProviderWebhookPayload, RefundDTO, UpdatePaymentCollectionDTO, UpdatePaymentDTO, UpdatePaymentSessionDTO, UpsertPaymentCollectionDTO } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Capture, Payment, PaymentCollection, PaymentSession, Refund } from "../models";
import PaymentProviderService from "./payment-provider";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    paymentService: ModulesSdkTypes.InternalModuleService<any>;
    captureService: ModulesSdkTypes.InternalModuleService<any>;
    refundService: ModulesSdkTypes.InternalModuleService<any>;
    paymentSessionService: ModulesSdkTypes.InternalModuleService<any>;
    paymentCollectionService: ModulesSdkTypes.InternalModuleService<any>;
    paymentProviderService: PaymentProviderService;
};
declare const PaymentModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, PaymentCollectionDTO, {
    PaymentCollection: {
        dto: PaymentCollectionDTO;
    };
    PaymentSession: {
        dto: PaymentSessionDTO;
    };
    Payment: {
        dto: PaymentDTO;
    };
    Capture: {
        dto: CaptureDTO;
    };
    Refund: {
        dto: RefundDTO;
    };
}>;
export default class PaymentModuleService<TPaymentCollection extends PaymentCollection = PaymentCollection, TPayment extends Payment = Payment, TCapture extends Capture = Capture, TRefund extends Refund = Refund, TPaymentSession extends PaymentSession = PaymentSession> extends PaymentModuleService_base implements IPaymentModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected paymentService_: ModulesSdkTypes.InternalModuleService<TPayment>;
    protected captureService_: ModulesSdkTypes.InternalModuleService<TCapture>;
    protected refundService_: ModulesSdkTypes.InternalModuleService<TRefund>;
    protected paymentSessionService_: ModulesSdkTypes.InternalModuleService<TPaymentSession>;
    protected paymentCollectionService_: ModulesSdkTypes.InternalModuleService<TPaymentCollection>;
    protected paymentProviderService_: PaymentProviderService;
    constructor({ baseRepository, paymentService, captureService, refundService, paymentSessionService, paymentProviderService, paymentCollectionService, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    createPaymentCollections(data: CreatePaymentCollectionDTO, sharedContext?: Context): Promise<PaymentCollectionDTO>;
    createPaymentCollections(data: CreatePaymentCollectionDTO[], sharedContext?: Context): Promise<PaymentCollectionDTO[]>;
    createPaymentCollections_(data: CreatePaymentCollectionDTO[], sharedContext?: Context): Promise<PaymentCollection[]>;
    updatePaymentCollections(paymentCollectionId: string, data: PaymentCollectionUpdatableFields, sharedContext?: Context): Promise<PaymentCollectionDTO>;
    updatePaymentCollections(selector: FilterablePaymentCollectionProps, data: PaymentCollectionUpdatableFields, sharedContext?: Context): Promise<PaymentCollectionDTO[]>;
    updatePaymentCollections_(data: UpdatePaymentCollectionDTO[], sharedContext?: Context): Promise<PaymentCollection[]>;
    upsertPaymentCollections(data: UpsertPaymentCollectionDTO[], sharedContext?: Context): Promise<PaymentCollectionDTO[]>;
    upsertPaymentCollections(data: UpsertPaymentCollectionDTO, sharedContext?: Context): Promise<PaymentCollectionDTO>;
    completePaymentCollections(paymentCollectionId: string, sharedContext?: Context): Promise<PaymentCollectionDTO>;
    completePaymentCollections(paymentCollectionId: string[], sharedContext?: Context): Promise<PaymentCollectionDTO[]>;
    createPaymentSession(paymentCollectionId: string, input: CreatePaymentSessionDTO, sharedContext?: Context): Promise<PaymentSessionDTO>;
    createPaymentSession_(paymentCollectionId: string, data: CreatePaymentSessionDTO, sharedContext?: Context): Promise<PaymentSession>;
    updatePaymentSession(data: UpdatePaymentSessionDTO, sharedContext?: Context): Promise<PaymentSessionDTO>;
    deletePaymentSession(id: string, sharedContext?: Context): Promise<void>;
    authorizePaymentSession(id: string, context: Record<string, unknown>, sharedContext?: Context): Promise<PaymentDTO>;
    updatePayment(data: UpdatePaymentDTO, sharedContext?: Context): Promise<PaymentDTO>;
    capturePayment(data: CreateCaptureDTO, sharedContext?: Context): Promise<PaymentDTO>;
    refundPayment(data: CreateRefundDTO, sharedContext?: Context): Promise<PaymentDTO>;
    cancelPayment(paymentId: string, sharedContext?: Context): Promise<PaymentDTO>;
    processEvent(eventData: ProviderWebhookPayload, sharedContext?: Context): Promise<void>;
    listPaymentProviders(filters?: FilterablePaymentProviderProps, config?: FindConfig<PaymentProviderDTO>, sharedContext?: Context): Promise<PaymentProviderDTO[]>;
    listAndCountPaymentProviders(filters?: FilterablePaymentProviderProps, config?: FindConfig<PaymentProviderDTO>, sharedContext?: Context): Promise<[PaymentProviderDTO[], number]>;
}
export {};
