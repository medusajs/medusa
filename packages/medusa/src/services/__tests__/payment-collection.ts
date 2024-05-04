import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import {
  PaymentCollection,
  PaymentCollectionStatus,
  PaymentCollectionType
} from "../../models"
import { PaymentCollectionsSessionsBatchInput } from "../../types/payment-collection"
import EventBusService from "../event-bus"
import {
  CustomerService,
  PaymentCollectionService,
  PaymentProviderService
} from "../index"
import { CustomerServiceMock } from "../__mocks__/customer"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import {
  DefaultProviderMock,
  PaymentProviderServiceMock
} from "../__mocks__/payment-provider"

describe("PaymentCollectionService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const paymentCollectionSample = {
    id: IdMap.getId("payment-collection-id1"),
    region_id: IdMap.getId("region1"),
    region: {
      payment_providers: [
        {
          id: IdMap.getId("region1_provider1"),
        },
        {
          id: IdMap.getId("region1_provider2"),
        },
      ],
    },
    payment_sessions: [
      {
        id: IdMap.getId("payCol_session1"),
        provider_id: IdMap.getId("region1_provider1"),
        amount: 100,
      },
    ],
    amount: 100,
    created_at: new Date(),
    metadata: {
      pluginInfo: "xyz",
    },
    status: PaymentCollectionStatus.NOT_PAID,
  }

  const paymentCollectionWithSessions = {
    id: IdMap.getId("payment-collection-session"),
    region_id: IdMap.getId("region1"),
    region: {
      payment_providers: [
        {
          id: IdMap.getId("region1_provider1"),
        },
      ],
    },
    payment_sessions: [
      {
        id: IdMap.getId("payCol_session1"),
        provider_id: IdMap.getId("region1_provider1"),
        amount: 100,
      },
    ],
    amount: 100,
    created_at: new Date(),
    status: PaymentCollectionStatus.NOT_PAID,
  } as PaymentCollection

  const paymentCollectionAuthorizedSample = {
    id: IdMap.getId("payment-collection-id2"),
    region_id: IdMap.getId("region1"),
    amount: 35000,
    status: PaymentCollectionStatus.AUTHORIZED,
    region: {
      payment_providers: [
        {
          id: IdMap.getId("region1_provider1"),
        },
      ],
    },
  }

  const zeroSample = {
    id: IdMap.getId("payment-collection-zero"),
    region_id: IdMap.getId("region1"),
    amount: 0,
    status: PaymentCollectionStatus.NOT_PAID,
  }

  const noSessionSample = {
    id: IdMap.getId("payment-collection-zero"),
    region_id: IdMap.getId("region1"),
    amount: 10000,
    status: PaymentCollectionStatus.NOT_PAID,
  }

  const fullyAuthorizedSample = {
    id: IdMap.getId("payment-collection-fully"),
    region_id: IdMap.getId("region1"),
    amount: 35000,
    authorized_amount: 35000,
    region: {
      payment_providers: [
        {
          id: IdMap.getId("region1_provider1"),
        },
      ],
    },
    payment_sessions: [
      {
        id: IdMap.getId("payCol_session1"),
        payment_authorized_at: Date.now(),
        provider_id: IdMap.getId("region1_provider1"),
        amount: 35000,
      },
    ],
    payments: [
      {
        id: IdMap.getId("payment-123"),
        amount: 35000,
      },
    ],
    status: PaymentCollectionStatus.AUTHORIZED,
  } as unknown as PaymentCollection

  const partiallyAuthorizedSample = {
    id: IdMap.getId("payment-collection-partial"),
    region_id: IdMap.getId("region1"),
    amount: 70000,
    authorized_amount: 35000,
    region: {
      payment_providers: [
        {
          id: IdMap.getId("region1_provider1"),
        },
      ],
    },
    payment_sessions: [
      {
        id: IdMap.getId("payCol_session1"),
        provider_id: IdMap.getId("region1_provider1"),
        amount: 35000,
      },
      {
        id: IdMap.getId("payCol_session2"),
        payment_authorized_at: Date.now(),
        provider_id: IdMap.getId("region1_provider1"),
        amount: 35000,
      },
    ],
    payments: [],
    status: PaymentCollectionStatus.PARTIALLY_AUTHORIZED,
  }

  const notAuthorizedSample = {
    id: IdMap.getId("payment-collection-not-authorized"),
    region_id: IdMap.getId("region1"),
    amount: 70000,
    region: {
      payment_providers: [
        {
          id: IdMap.getId("region1_provider1"),
        },
      ],
    },
    payment_sessions: [
      {
        id: IdMap.getId("payCol_session1"),
        provider_id: IdMap.getId("region1_provider1"),
        amount: 35000,
      },
      {
        id: IdMap.getId("payCol_session2"),
        provider_id: IdMap.getId("region1_provider1"),
        amount: 35000,
      },
    ],
    payments: [],
    status: PaymentCollectionStatus.PARTIALLY_AUTHORIZED,
  } as unknown as PaymentCollection

  const paymentCollectionRepository = MockRepository({
    find: (query) => {
      const map = {
        [IdMap.getId("payment-collection-id1")]: paymentCollectionSample,
        [IdMap.getId("payment-collection-id2")]:
          paymentCollectionAuthorizedSample,
        [IdMap.getId("payment-collection-session")]:
          paymentCollectionWithSessions,
        [IdMap.getId("payment-collection-zero")]: zeroSample,
        [IdMap.getId("payment-collection-no-session")]: noSessionSample,
        [IdMap.getId("payment-collection-fully")]: fullyAuthorizedSample,
        [IdMap.getId("payment-collection-partial")]: partiallyAuthorizedSample,
        [IdMap.getId("payment-collection-not-authorized")]: notAuthorizedSample,
      }

      if (map[query?.where?.id]) {
        return [{ ...map[query?.where?.id] }]
      }
      return
    },
    create: (data) => {
      return {
        ...paymentCollectionSample,
        ...data,
      }
    },
    save: (data) => {
      return data
    },
  })

  paymentCollectionRepository.deleteMultiple = jest
    .fn()
    .mockImplementation(() => {
      return Promise.resolve()
    })

  paymentCollectionRepository.getPaymentCollectionIdBySessionId = jest
    .fn()
    .mockImplementation(async () => {
      return paymentCollectionWithSessions
    })

  const paymentCollectionService = new PaymentCollectionService({
    manager: MockManager,
    paymentCollectionRepository,
    eventBusService: EventBusServiceMock as unknown as EventBusService,
    paymentProviderService:
      PaymentProviderServiceMock as unknown as PaymentProviderService,
    customerService: CustomerServiceMock as unknown as CustomerService,
  })

  it("should retrieve a payment collection", async () => {
    await paymentCollectionService.retrieve(
      IdMap.getId("payment-collection-id1")
    )
    expect(paymentCollectionRepository.find).toHaveBeenCalledTimes(1)
    expect(paymentCollectionRepository.find).toHaveBeenCalledWith({
      where: { id: IdMap.getId("payment-collection-id1") },
    })
  })

  it("should throw error if payment collection is not found", async () => {
    const payCol = paymentCollectionService.retrieve(
      IdMap.getId("payment-collection-non-existing-id")
    )

    expect(payCol).rejects.toThrow(Error)
    expect(paymentCollectionRepository.find).toBeCalledTimes(1)
  })

  it("should create a payment collection", async () => {
    const entity = await paymentCollectionService.create({
      region_id: IdMap.getId("region2"),
      type: PaymentCollectionType.ORDER_EDIT,
      currency_code: "USD",
      amount: 190,
      created_by: IdMap.getId("user-id"),
      description: "some description",
      metadata: {
        abc: 123,
      },
    })
    expect(paymentCollectionRepository.save).toHaveBeenCalledTimes(1)
    expect(paymentCollectionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: IdMap.getId("payment-collection-id1"),
        region_id: IdMap.getId("region2"),
        amount: 190,
        created_by: IdMap.getId("user-id"),
        status: PaymentCollectionStatus.NOT_PAID,
        description: "some description",
        metadata: {
          abc: 123,
        },
      })
    )

    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
      PaymentCollectionService.Events.CREATED,
      entity
    )
  })

  it("should update a payment collection with the right arguments", async () => {
    const submittedChanges = {
      description: "updated description",
      metadata: {
        extra: 123,
        arr: ["a", "b", "c"],
      },
    }
    const internalChanges = {
      ...submittedChanges,
    }
    internalChanges.metadata = {
      ...internalChanges.metadata,
      ...{
        pluginInfo: "xyz",
      },
    }

    const entity = await paymentCollectionService.update(
      IdMap.getId("payment-collection-id1"),
      submittedChanges
    )
    expect(paymentCollectionRepository.save).toHaveBeenCalledTimes(1)
    expect(paymentCollectionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(internalChanges)
    )

    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
      PaymentCollectionService.Events.UPDATED,
      entity
    )
  })

  it("should throw error to update a non-existing payment collection", async () => {
    const submittedChanges = {
      description: "updated description",
      metadata: {
        extra: 123,
        arr: ["a", "b", "c"],
      },
    }

    const payCol = paymentCollectionService.update(
      IdMap.getId("payment-collection-non-existing"),
      submittedChanges
    )

    expect(payCol).rejects.toThrow(Error)
    expect(paymentCollectionRepository.save).toBeCalledTimes(0)
    expect(EventBusServiceMock.emit).toBeCalledTimes(0)
  })

  it("should delete a payment collection", async () => {
    const entity = await paymentCollectionService.delete(
      IdMap.getId("payment-collection-id1")
    )
    expect(paymentCollectionRepository.remove).toHaveBeenCalledTimes(1)
    expect(paymentCollectionRepository.remove).toHaveBeenCalledWith(
      expect.objectContaining({
        id: IdMap.getId("payment-collection-id1"),
        region_id: IdMap.getId("region1"),
        amount: 100,
      })
    )

    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    expect(EventBusServiceMock.emit).toHaveBeenCalledWith(
      PaymentCollectionService.Events.DELETED,
      entity
    )
  })

  it("should ignore to delete a non-existing payment collection", async () => {
    const entity = await paymentCollectionService.delete(
      IdMap.getId("payment-collection-non-existing")
    )
    expect(paymentCollectionRepository.remove).toHaveBeenCalledTimes(0)
    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(0)
    expect(entity).toBe(undefined)
  })

  it("should throw and error when trying to delete an initialized payment collection", async () => {
    const entity = paymentCollectionService.delete(
      IdMap.getId("payment-collection-id2")
    )
    expect(paymentCollectionRepository.remove).toHaveBeenCalledTimes(0)

    expect(entity).rejects.toThrow(Error)
  })

  describe("Manage Single Payment Session", () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should throw error if payment collection doesn't have the correct status", async () => {
      const ret = paymentCollectionService.setPaymentSession(
        IdMap.getId("payment-collection-id2"),
        {
          provider_id: IdMap.getId("region1_provider1"),
        },
        "customer1"
      )

      expect(ret).rejects.toThrowError(
        new Error(
          `Cannot set payment sessions for a payment collection with status ${PaymentCollectionStatus.AUTHORIZED}`
        )
      )
      expect(PaymentProviderServiceMock.createSession).toBeCalledTimes(0)
    })

    it("should ignore session if provider doesn't belong to the region", async () => {
      const multiRet = paymentCollectionService.setPaymentSession(
        IdMap.getId("payment-collection-id1"),
        {
          provider_id: IdMap.getId("region1_invalid_provider"),
        },
        "customer1"
      )

      expect(multiRet).rejects.toThrow(`Payment provider not found`)
      expect(PaymentProviderServiceMock.createSession).toBeCalledTimes(0)
    })

    it("should add a new session", async () => {
      await paymentCollectionService.setPaymentSession(
        IdMap.getId("payment-collection-id1"),
        {
          provider_id: IdMap.getId("region1_provider2"),
        },
        "lebron"
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(paymentCollectionRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should update an existing one", async () => {
      await paymentCollectionService.setPaymentSession(
        IdMap.getId("payment-collection-id1"),
        {
          provider_id: IdMap.getId("region1_provider1"),
        },
        "lebron"
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(0)
      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(paymentCollectionRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should add a new session and delete existing one", async () => {
      const inp: PaymentCollectionsSessionsBatchInput[] = [
        {
          amount: 100,
          provider_id: IdMap.getId("region1_provider1"),
        },
      ]
      await paymentCollectionService.setPaymentSessionsBatch(
        IdMap.getId("payment-collection-session"),
        inp,
        IdMap.getId("lebron")
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(1)
      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledTimes(0)
      expect(paymentCollectionRepository.delete).toHaveBeenCalledTimes(1)

      expect(paymentCollectionRepository.save).toHaveBeenCalledTimes(1)
    })
  })

  describe("Manage Multiple Payment Sessions", () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should throw error if payment collection doesn't have the correct status", async () => {
      const inp: PaymentCollectionsSessionsBatchInput[] = [
        {
          amount: 100,
          provider_id: IdMap.getId("region1_provider1"),
        },
      ]
      const ret = paymentCollectionService.setPaymentSessionsBatch(
        IdMap.getId("payment-collection-id2"),
        inp,
        "customer1"
      )

      expect(ret).rejects.toThrowError(
        new Error(
          `Cannot set payment sessions for a payment collection with status ${PaymentCollectionStatus.AUTHORIZED}`
        )
      )

      expect(PaymentProviderServiceMock.createSession).toBeCalledTimes(0)
    })

    it("should throw error if amount is different than requested", async () => {
      const inp: PaymentCollectionsSessionsBatchInput[] = [
        {
          amount: 101,
          provider_id: IdMap.getId("region1_provider1"),
        },
      ]

      const ret = paymentCollectionService.setPaymentSessionsBatch(
        IdMap.getId("payment-collection-id1"),
        inp,
        "customer1"
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(0)
      expect(ret).rejects.toThrow(
        `The sum of sessions is not equal to 100 on Payment Collection`
      )

      const multInp: PaymentCollectionsSessionsBatchInput[] = [
        {
          amount: 51,
          provider_id: IdMap.getId("region1_provider1"),
        },
        {
          amount: 50,
          provider_id: IdMap.getId("region1_provider2"),
        },
      ]
      const multiRet = paymentCollectionService.setPaymentSessionsBatch(
        IdMap.getId("payment-collection-id1"),
        multInp,
        "customer1"
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(0)
      expect(multiRet).rejects.toThrow(
        `The sum of sessions is not equal to 100 on Payment Collection`
      )
    })

    it("should ignore sessions where provider doesn't belong to the region", async () => {
      const multInp: PaymentCollectionsSessionsBatchInput[] = [
        {
          amount: 50,
          provider_id: IdMap.getId("region1_provider1"),
        },
        {
          amount: 50,
          provider_id: IdMap.getId("region1_invalid_provider"),
        },
      ]
      const multiRet = paymentCollectionService.setPaymentSessionsBatch(
        IdMap.getId("payment-collection-id1"),
        multInp,
        "customer1"
      )

      expect(multiRet).rejects.toThrow(
        `The sum of sessions is not equal to 100 on Payment Collection`
      )
      expect(PaymentProviderServiceMock.createSession).toBeCalledTimes(0)
    })

    it("should add a new session and update existing one", async () => {
      const inp: PaymentCollectionsSessionsBatchInput[] = [
        {
          session_id: IdMap.getId("payCol_session1"),
          amount: 50,
          provider_id: IdMap.getId("region1_provider1"),
        },
        {
          amount: 50,
          provider_id: IdMap.getId("region1_provider1"),
        },
      ]
      await paymentCollectionService.setPaymentSessionsBatch(
        IdMap.getId("payment-collection-session"),
        inp,
        "lebron"
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(1)
      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(paymentCollectionRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should add a new session and delete existing one", async () => {
      const inp: PaymentCollectionsSessionsBatchInput[] = [
        {
          amount: 100,
          provider_id: IdMap.getId("region1_provider1"),
        },
      ]
      await paymentCollectionService.setPaymentSessionsBatch(
        IdMap.getId("payment-collection-session"),
        inp,
        IdMap.getId("lebron")
      )

      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(1)
      expect(PaymentProviderServiceMock.updateSession).toHaveBeenCalledTimes(0)
      expect(paymentCollectionRepository.delete).toHaveBeenCalledTimes(1)

      expect(paymentCollectionRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should refresh a payment session", async () => {
      await paymentCollectionService.refreshPaymentSession(
        IdMap.getId("payment-collection-session"),
        IdMap.getId("payCol_session1"),
        "customer1"
      )

      expect(PaymentProviderServiceMock.refreshSession).toHaveBeenCalledTimes(1)
      expect(DefaultProviderMock.deletePayment).toHaveBeenCalledTimes(1)
      expect(PaymentProviderServiceMock.createSession).toHaveBeenCalledTimes(1)
    })

    it("should throw to refresh a payment session that doesn't exist", async () => {
      const sess = paymentCollectionService.refreshPaymentSession(
        IdMap.getId("payment-collection-session"),
        IdMap.getId("payCol_session-not-found"),
        "customer1"
      )

      expect(sess).rejects.toThrow(
        `Session with id ${IdMap.getId(
          "payCol_session-not-found"
        )} was not found`
      )
      expect(PaymentProviderServiceMock.refreshSession).toBeCalledTimes(0)
      expect(DefaultProviderMock.deletePayment).toBeCalledTimes(0)
      expect(PaymentProviderServiceMock.createSession).toBeCalledTimes(0)
    })
  })

  describe("Authorize Payments", () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should mark as authorized if amount is 0", async () => {
      const auth = await paymentCollectionService.authorizePaymentSessions(
        IdMap.getId("payment-collection-zero"),
        []
      )

      expect(PaymentProviderServiceMock.authorizePayment).toHaveBeenCalledTimes(
        0
      )
      expect(auth.status).toBe(PaymentCollectionStatus.AUTHORIZED)
    })

    it("should reject payment collection without payment sessions", async () => {
      const ret = paymentCollectionService.authorizePaymentSessions(
        IdMap.getId("payment-collection-no-session"),
        []
      )

      expect(ret).rejects.toThrowError(
        new Error(
          "You cannot complete a Payment Collection without a payment session."
        )
      )
    })

    it("should call authorizePayments for all sessions", async () => {
      await paymentCollectionService.authorizePaymentSessions(
        IdMap.getId("payment-collection-not-authorized"),
        [IdMap.getId("payCol_session1"), IdMap.getId("payCol_session2")]
      )

      expect(PaymentProviderServiceMock.authorizePayment).toHaveBeenCalledTimes(
        2
      )
      expect(PaymentProviderServiceMock.createPayment).toHaveBeenCalledTimes(2)
      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    })

    it("should skip authorized sessions - partially authorized", async () => {
      await paymentCollectionService.authorizePaymentSessions(
        IdMap.getId("payment-collection-partial"),
        [IdMap.getId("payCol_session1"), IdMap.getId("payCol_session2")]
      )

      expect(PaymentProviderServiceMock.authorizePayment).toHaveBeenCalledTimes(
        1
      )
      expect(PaymentProviderServiceMock.createPayment).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
    })

    it("should skip authorized sessions - fully authorized", async () => {
      await paymentCollectionService.authorizePaymentSessions(
        IdMap.getId("payment-collection-fully"),
        [IdMap.getId("payCol_session1"), IdMap.getId("payCol_session2")]
      )

      expect(PaymentProviderServiceMock.authorizePayment).toHaveBeenCalledTimes(
        0
      )
      expect(PaymentProviderServiceMock.createPayment).toHaveBeenCalledTimes(0)
      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(0)
    })
  })
})
