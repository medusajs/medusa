import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  RetrieveAccountHolderInput,
  RetrieveAccountHolderOutput,
  CreateAccountHolderInput,
  CreateAccountHolderOutput,
  DAL,
  DeleteAccountHolderInput,
  DeleteAccountHolderOutput,
  DeletePaymentMethodInput,
  DeletePaymentMethodOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  IPaymentProvider,
  ListPaymentMethodsInput,
  ListPaymentMethodsOutput,
  Logger,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  SavePaymentMethodInput,
  SavePaymentMethodOutput,
  UpdateAccountHolderInput,
  UpdateAccountHolderOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import { ModulesSdkUtils } from "@medusajs/framework/utils"
import { PaymentProvider } from "@models"

type InjectedDependencies = {
  logger?: Logger
  paymentProviderRepository: DAL.RepositoryService
  [key: `pp_${string}`]: IPaymentProvider
}

export default class PaymentProviderService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  PaymentProvider
) {
  #logger: Logger

  constructor(container: InjectedDependencies) {
    super(container)
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  retrieveProvider(providerId: string): IPaymentProvider {
    try {
      return this.__container__[providerId] as IPaymentProvider
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
Unable to retrieve the payment provider with id: ${providerId}
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`

        // Log full error for debugging
        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the payment provider with id: ${providerId}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
    }
  }

  async createSession(
    providerId: string,
    sessionInput: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const provider = this.retrieveProvider(providerId)

    return await provider.initiatePayment(sessionInput)
  }

  async updateSession(
    providerId: string,
    sessionInput: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    const provider = this.retrieveProvider(providerId)

    return await provider.updatePayment(sessionInput)
  }

  async deleteSession(
    providerId: string,
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    const provider = this.retrieveProvider(providerId)
    return await provider.deletePayment(input)
  }

  async authorizePayment(
    providerId: string,
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const provider = this.retrieveProvider(providerId)
    return await provider.authorizePayment(input)
  }

  async getStatus(
    providerId: string,
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const provider = this.retrieveProvider(providerId)
    return await provider.getPaymentStatus(input)
  }

  async capturePayment(
    providerId: string,
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    const provider = this.retrieveProvider(providerId)
    return await provider.capturePayment(input)
  }

  async cancelPayment(
    providerId: string,
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    const provider = this.retrieveProvider(providerId)
    return await provider.cancelPayment(input)
  }

  async refundPayment(
    providerId: string,
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const provider = this.retrieveProvider(providerId)
    return await provider.refundPayment(input)
  }

  async retrieveAccountHolder(
    providerId: string,
    input: RetrieveAccountHolderInput
  ): Promise<RetrieveAccountHolderOutput> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.retrieveAccountHolder) {
      this.#logger.warn(
        `Provider ${providerId} does not support retrieving account holders`
      )
      return {} as unknown as RetrieveAccountHolderOutput
    }

    return await provider.retrieveAccountHolder(input)
  }

  async createAccountHolder(
    providerId: string,
    input: CreateAccountHolderInput
  ): Promise<CreateAccountHolderOutput> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.createAccountHolder) {
      this.#logger.warn(
        `Provider ${providerId} does not support creating account holders`
      )
      return {} as unknown as CreateAccountHolderOutput
    }

    return await provider.createAccountHolder(input)
  }

  async updateAccountHolder(
    providerId: string,
    input: UpdateAccountHolderInput
  ): Promise<UpdateAccountHolderOutput> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.updateAccountHolder) {
      this.#logger.warn(
        `Provider ${providerId} does not support updating account holders`
      )
      return {} as unknown as UpdateAccountHolderOutput
    }

    return await provider.updateAccountHolder(input)
  }

  async deleteAccountHolder(
    providerId: string,
    input: DeleteAccountHolderInput
  ): Promise<DeleteAccountHolderOutput> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.deleteAccountHolder) {
      this.#logger.warn(
        `Provider ${providerId} does not support deleting account holders`
      )
      return {}
    }

    return await provider.deleteAccountHolder(input)
  }

  async listPaymentMethods(
    providerId: string,
    input: ListPaymentMethodsInput
  ): Promise<ListPaymentMethodsOutput> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.listPaymentMethods) {
      this.#logger.warn(
        `Provider ${providerId} does not support listing payment methods`
      )
      return []
    }

    return await provider.listPaymentMethods(input)
  }

  async savePaymentMethod(
    providerId: string,
    input: SavePaymentMethodInput
  ): Promise<SavePaymentMethodOutput> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.savePaymentMethod) {
      this.#logger.warn(
        `Provider ${providerId} does not support saving payment methods`
      )
      return {} as unknown as SavePaymentMethodOutput
    }

    return await provider.savePaymentMethod(input)
  }

  async deletePaymentMethod(
    providerId: string,
    input: DeletePaymentMethodInput
  ): Promise<DeletePaymentMethodOutput> {
    const provider = this.retrieveProvider(providerId)
    if (!provider.deletePaymentMethod) {
      this.#logger.warn(
        `Provider ${providerId} does not support deleting payment methods`
      )
      return {}
    }

    return await provider.deletePaymentMethod(input)
  }

  async getWebhookActionAndData(
    providerId: string,
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const provider = this.retrieveProvider(providerId)

    return await provider.getWebhookActionAndData(data)
  }
}
