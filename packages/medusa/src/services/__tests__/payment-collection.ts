import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { EventBusService, PaymentCollectionService } from "../index"
import { PaymentCollectionStatus, PaymentCollectionType } from "../../models"
import { EventBusServiceMock } from "../__mocks__/event-bus"

describe("PaymentCollectionService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const paymentCollectionSample = {
    id: IdMap.getId("payment-collection-id1"),
    region_id: IdMap.getId("region1"),
    amount: 100,
    created_at: new Date(),
    metadata: {
      pluginInfo: "xyz",
    },
    status: PaymentCollectionStatus.NOT_PAID,
  }

  const paymentCollectionAuthorizedSample = {
    id: IdMap.getId("payment-collection-id2"),
    region_id: IdMap.getId("region1"),
    amount: 35000,
    status: PaymentCollectionStatus.AUTHORIZED,
  }

  const paymentCollectionRepository = MockRepository({
    findOne: (query) => {
      const map = {
        [IdMap.getId("payment-collection-id1")]: paymentCollectionSample,
        [IdMap.getId("payment-collection-id2")]:
          paymentCollectionAuthorizedSample,
      }

      if (map[query?.where?.id]) {
        return { ...map[query?.where?.id] }
      }
      return
    },
    create: (data) => {
      return {
        ...paymentCollectionSample,
        ...data,
      }
    },
  })

  const paymentCollectionService = new PaymentCollectionService({
    manager: MockManager,
    paymentCollectionRepository,
    eventBusService: EventBusServiceMock as unknown as EventBusService,
  })

  it("should retrieve a payment collection", async () => {
    await paymentCollectionService.retrieve(
      IdMap.getId("payment-collection-id1")
    )
    expect(paymentCollectionRepository.findOne).toHaveBeenCalledTimes(1)
    expect(paymentCollectionRepository.findOne).toHaveBeenCalledWith({
      where: { id: IdMap.getId("payment-collection-id1") },
    })
  })

  it("should throw error if payment collection is not found", async () => {
    const payCol = paymentCollectionService.retrieve(
      IdMap.getId("payment-collection-non-existing-id")
    )

    expect(paymentCollectionRepository.findOne).toHaveBeenCalledTimes(1)
    expect(payCol).rejects.toThrow(Error)
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
      status: PaymentCollectionStatus.CAPTURED,
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
      status: PaymentCollectionStatus.CAPTURED,
      metadata: {
        extra: 123,
        arr: ["a", "b", "c"],
      },
    }

    const payCol = paymentCollectionService.update(
      IdMap.getId("payment-collection-non-existing"),
      submittedChanges
    )
    expect(paymentCollectionRepository.save).toHaveBeenCalledTimes(0)
    expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(0)
    expect(payCol).rejects.toThrow(Error)
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
})
