import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex} from "typeorm"

export class GiftCardVariantId1694456309927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("gift_card", new TableColumn(
            {
                name: "variant_id",
                type: "varchar",
                isNullable: true,
            }
        ))
        await queryRunner.createForeignKey(
            "gift_card",
            new TableForeignKey({
                name: "FK_gift_card_variant_id_",
                columnNames: ["variant_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "product_variant"
            }),
        )
        await queryRunner.createIndex("gift_card", new TableIndex({
            name: "IDX_gift_card_variant_id",
            columnNames: ["variant_id"]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("gift_card", "IDX_gift_card_variant_id")
        await queryRunner.dropForeignKey("gift_card", "FK_gift_card_variant_id")
        await queryRunner.dropColumn("gift_card", "variant_id")
    }
}
