import { KafkaConfig, KafkaMessage } from "kafkajs"

export type KafkaModuleOptions = {
  kafkaConfig: KafkaConfig
  noConsumer?: boolean
  topic?: string
}

export type ConsumerPayload = {
  topic: string
  partition: number
  message: KafkaMessage
}
