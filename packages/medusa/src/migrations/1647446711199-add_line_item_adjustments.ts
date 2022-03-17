import {MigrationInterface, QueryRunner} from "typeorm";

export class addLineItemAdjustments1647446711199 implements MigrationInterface {
    name = 'addLineItemAdjustments1647446711199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "line_item_adjustment" ("id" character varying NOT NULL, "item_id" character varying NOT NULL, "description" character varying NOT NULL, "discount_id" character varying, "amount" integer NOT NULL, "metadata" jsonb, CONSTRAINT "liauniq" UNIQUE ("item_id", "discount_id"), CONSTRAINT "PK_2b1360103753df2dc8257c2c8c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be9aea2ccf3567007b6227da4d" ON "line_item_adjustment" ("item_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2f41b20a71f30e60471d7e3769" ON "line_item_adjustment" ("discount_id") `);
        await queryRunner.query(`ALTER TABLE "line_item_adjustment" ADD CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "line_item_adjustment" ADD CONSTRAINT "FK_2f41b20a71f30e60471d7e3769c" FOREIGN KEY ("discount_id") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`
            WITH item_discounts AS (
                SELECT
                    o.id AS order_id,
                    disc.code,
                    disc.id as discount_id,
                    dr.id AS rule_id,
                    dr.allocation,
                    dr.value,
                    dr.type
                FROM "order" o
                LEFT JOIN order_discounts od ON od.order_id = o.id
                LEFT JOIN discount disc ON od.discount_id = disc.id
                LEFT JOIN discount_rule dr ON dr.id = disc.rule_id
            ),
            line_item_subtotal AS (
                SELECT *, li.quantity * li.unit_price AS subtotal
                FROM line_item li
            ),
            order_discountable_subtotal AS (
                SELECT order_id, sum(subtotal)::bigint AS discountable_subtotal
                FROM line_item_subtotal
                WHERE allow_discounts = true
                GROUP BY order_id
            ),
            line_item_allocations AS (
                SELECT
                    COALESCE(ROUND(CASE
                        WHEN disc.type = 'percentage' THEN li.subtotal * (disc.value::float / 100)
                         WHEN disc.type = 'fixed' THEN li.subtotal * (LEAST(COALESCE(disc.value, 0), ods.discountable_subtotal)::float / ods.discountable_subtotal)
                        ELSE 0
                    END), 0) AS discount_total,
                    disc.discount_id,
                    disc.code,
                    disc.allocation,
                    disc.type,
                    disc.value,
                    li.*
                FROM "line_item_subtotal" li
                LEFT JOIN "order" o ON o.id = li.order_id
                LEFT JOIN "item_discounts" disc ON o.id = disc.order_id
                LEFT JOIN "order_discountable_subtotal" ods ON ods.order_id = li.order_id
                WHERE type != 'free_shipping'
            ),
            line_item_total AS (
                SELECT lis.id, sum(lia.discount_total) AS discount_total
                FROM line_item_subtotal lis
                LEFT JOIN line_item_allocations lia ON lia.id = lis.id
                GROUP BY lis.id
            ),
            shipping_total AS (
                SELECT
                    id,
                    total,
                    total * tax_rate AS tax_total
                FROM (
                    SELECT 
                        o.id, 
                        sm.price AS total, 
                        (o.tax_rate::float / 100) AS tax_rate
                    FROM "order" o
                    LEFT JOIN shipping_method sm ON sm.order_id = o.id
                ) clean
            )
            INSERT INTO line_item_adjustment (id, amount, discount_id, item_id, description)
            (SELECT ROW_NUMBER() OVER(ORDER BY id),
                discount_total,
                discount_id,
                id, 
                'discount' as description
            FROM line_item_allocations
            WHERE order_id in (
                    SELECT order_id FROM "order_discounts" od
                    LEFT JOIN discount disc ON od.discount_id = disc.id
                    LEFT join discount_rule dr ON dr.id = disc.rule_id
                )
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_item_adjustment" DROP CONSTRAINT "FK_2f41b20a71f30e60471d7e3769c"`);
        await queryRunner.query(`ALTER TABLE "line_item_adjustment" DROP CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2"`);
        await queryRunner.query(`DROP INDEX "IDX_2f41b20a71f30e60471d7e3769"`);
        await queryRunner.query(`DROP INDEX "IDX_be9aea2ccf3567007b6227da4d"`);
        await queryRunner.query(`DROP TABLE "line_item_adjustment"`);
    }

}
