import { Kafka, Producer, Consumer, Message } from "kafkajs"
import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import { EmitData, Logger } from "@medusajs/types"
import { AbstractEventBusModuleService } from "@medusajs/utils"
import { KafkaModuleOptions, ConsumerPayload } from "../types"

type InjectedDependencies = {
  logger: Logger
}

class KafkaEventBusService extends AbstractEventBusModuleService {
  protected readonly logger_: Logger
  protected readonly moduleOptions_: KafkaModuleOptions
  // eslint-disable-next-line max-len
  protected readonly moduleDeclaration_: InternalModuleDeclaration

  protected producer: Producer
  protected consumer: Consumer

  constructor(
    { logger }: InjectedDependencies,
    moduleOptions: KafkaModuleOptions
  ) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    if (moduleOptions === undefined) {
      throw new Error(`Module options are required for Kafka Relay`)
    }

    this.moduleOptions_ = moduleOptions
    this.logger_ = logger

    const kafka = new Kafka(moduleOptions.kafkaConfig)

    this.producer = kafka.producer()
    if (!moduleOptions.noConsumer) {
      this.consumer = kafka.consumer({ groupId: "medusa-event-bus" })
      this.initConsumer()
    }
  }

  private getTopic(): string {
    return this.moduleOptions_.topic ?? "medusa-event-bus"
  }

  async initConsumer() {
    await this.consumer.connect()
    await this.consumer.subscribe({ topic: this.getTopic() })
    await this.consumer.run({
      eachMessage: this.doWork,
    })
  }

  async doWork({ message }: ConsumerPayload): Promise<void> {
    if (!message || !message.value) {
      return
    }

    const { eventName, data } = JSON.parse(message.value.toString())
    const eventSubscribers = this.eventToSubscribersMap.get(eventName) || []
    const wildcardSubscribers = this.eventToSubscribersMap.get("*") || []
    const allSubscribers = eventSubscribers.concat(wildcardSubscribers)

    this.logger_.info(
      `Processing ${eventName} which has ${eventSubscribers.length} subscribers`
    )
    await Promise.all(
      allSubscribers.map(async ({ id, subscriber }) => {
        return await subscriber(data, eventName).catch((err) => {
          this.logger_.warn(
            `An error occurred in subscriber with id: ${id} while processing ${eventName}: ${err}`
          )
          return err
        })
      })
    )
  }

  async emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>
  async emit<T>(data: EmitData<T>[]): Promise<void>
  async emit<T, TInput extends string | EmitData<T>[] = string>(
    eventNameOrData: TInput,
    data?: T
  ): Promise<void> {
    await this.producer.connect()

    const isBulkEmit = Array.isArray(eventNameOrData)

    const messages = isBulkEmit
      ? eventNameOrData.map((event) => this.transformEvent(event))
      : [this.transformEvent({ eventName: eventNameOrData, data })]

    this.producer.send({
      topic: this.getTopic(),
      messages,
    })
  }

  private transformEvent(
    event: EmitData<{ id?: string } | undefined>
  ): Message {
    let key: string | null = null

    if (event.data && typeof event.data.id === "string") {
      key = event.data.id
    }

    return {
      key,
      value: JSON.stringify(event),
    }
  }
}

export default KafkaEventBusService
