import { Migration } from "@medusajs/framework/mikro-orm/migrations"
import { ulid } from "ulid"

export class Migration20250924135437 extends Migration {
  override async up(): Promise<void> {
    const [existingReason] = await this.execute(`
      SELECT 1 as exists
      FROM "refund_reason"
      LIMIT 1
    `)

    if (!existingReason) {
      // 2. Create default shipping option type
      await this.execute(`
        INSERT INTO "refund_reason" (id, label, description)
        VALUES 
          ('refr_${ulid()}', 'Shipping Issue', 'Refund due to lost, delayed, or misdelivered shipment'),
          ('refr_${ulid()}', 'Customer Care Adjustment', 'Refund given as goodwill or compensation for inconvenience'),
          ('refr_${ulid()}', 'Pricing Error', 'Refund to correct an overcharge, missing discount, or incorrect price');
      `)
    }
  }

  override async down(): Promise<void> {
    // Remove the default refund reasons we created
    this.addSql(`
      DELETE FROM "refund_reason"
      WHERE ("label", "description") IN (
        ('Shipping Issue', 'Refund due to lost, delayed, or misdelivered shipment'),
        ('Customer Care Adjustment', 'Refund given as goodwill or compensation for inconvenience'),
        ('Pricing Error', 'Refund to correct an overcharge, missing discount, or incorrect price')
      )
    `)
  }
}
