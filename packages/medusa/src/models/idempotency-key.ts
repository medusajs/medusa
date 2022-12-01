import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class IdempotencyKey {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  idempotency_key: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @DbAwareColumn({ type: "timestamptz", nullable: true })
  locked_at: Date

  @Column({ nullable: true })
  request_method: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  request_params: Record<string, unknown>

  @Column({ nullable: true })
  request_path: string

  @Column({ type: "int", nullable: true })
  response_code: number

  @DbAwareColumn({ type: "jsonb", nullable: true })
  response_body: Record<string, unknown>

  @Column({ default: "started" })
  recovery_point: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ikey")
  }
}

/**
 * @schema idempotency_key
 * title: "Idempotency Key"
 * description: "Idempotency Key is used to continue a process in case of any failure that might occur."
 * x-resourceId: idempotency_key
 * type: object
 * required:
 *   - idempotency_key
 * properties:
 *   id:
 *     type: string
 *     description: The idempotency key's ID
 *     example: ikey_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   idempotency_key:
 *     description: "The unique randomly generated key used to determine the state of a process."
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/advanced/backend/payment/overview#idempotency-key
 *       description: Learn more how to use the idempotency key.
 *   created_at:
 *     description: Date which the idempotency key was locked.
 *     type: string
 *     format: date-time
 *   locked_at:
 *     description: Date which the idempotency key was locked.
 *     type: string
 *     format: date-time
 *   request_method:
 *     description: "The method of the request"
 *     type: string
 *     example: POST
 *   request_params:
 *     type: object
 *     description: "The parameters passed to the request"
 *     example:
 *       id: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   request_path:
 *     description: "The request's path"
 *     type: string
 *     example: /store/carts/cart_01G8ZH853Y6TFXWPG5EYE81X63/complete
 *   response_code:
 *     type: string
 *     description: "The response's code."
 *     example: 200
 *   response_body:
 *     type: object
 *     description: "The response's body"
 *     example:
 *       id: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   recovery_point:
 *     type: string
 *     description: "Where to continue from."
 *     default: started
 */