import { Kafka } from "kafkajs"
import { Logger } from "@medusajs/modules-sdk"
import KafkaEventBusService from "../event-bus-kafka"

const mockProducerConnect = jest.fn()
const mockConsumerConnect = jest.fn()
const mockSubscribe = jest.fn()
const mockRun = jest.fn()
const mockSend = jest.fn().mockResolvedValue({})

jest.mock("kafkajs", () => {
  class KafkaMock {
    constructor() {
      this.producer = jest.fn().mockImplementation(() => {
        return {
          connect: mockProducerConnect,
          send: mockSend,
        }
      })
      this.consumer = jest.fn().mockImplementation(() => {
        return {
          connect: mockConsumerConnect,
          subscribe: mockSubscribe,
          run: mockRun,
        }
      })
    }
  }

  return {
    Kafka: KafkaMock,
  }
})

const loggerMock = {
  info: jest.fn().mockReturnValue(),
  warn: jest.fn().mockReturnValue(),
  error: jest.fn().mockReturnValue(),
}

describe("KafkaEventBusService", () => {
  let service
  let logger = loggerMock

  beforeEach(() => {
    const options = { kafkaConfig: { brokers: ["localhost:9092"] } }
    service = new KafkaEventBusService({ logger }, options)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should throw error if moduleOptions is undefined", () => {
    expect(() => new KafkaEventBusService({ logger }, undefined)).toThrow(
      "Module options are required for Kafka Relay"
    )
  })

  it("should create Kafka producer and consumer", () => {
    expect(service.producer).toBeDefined()
    expect(service.consumer).toBeDefined()
  })

  it("should not create consumer if noConsumer is true", () => {
    const options = {
      kafkaConfig: { brokers: ["localhost:9092"] },
      noConsumer: true,
    }
    service = new KafkaEventBusService({ logger }, options)
    expect(service.consumer).toBeUndefined()
  })

  it("should connect, subscribe and run consumer on initConsumer", async () => {
    expect(mockConsumerConnect).toBeCalledTimes(1)
    expect(mockSubscribe).toBeCalledWith({
      topic: "medusa-event-bus",
    })
    expect(mockRun).toBeCalledTimes(1)
  })

  it("should connect producer and send messages on emit", async () => {
    const eventName = "test"
    const data = { id: "1", name: "test data" }
    await service.emit(eventName, data)

    expect(mockConsumerConnect).toBeCalledTimes(1)
    expect(mockProducerConnect).toBeCalledTimes(1)
    expect(mockSend).toBeCalledWith({
      topic: "medusa-event-bus",
      messages: [{ key: data.id, value: JSON.stringify({ eventName, data }) }],
    })
  })
})
