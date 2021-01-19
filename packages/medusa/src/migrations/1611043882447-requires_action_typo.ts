import {MigrationInterface, QueryRunner} from "typeorm";

export class requiresActionTypo1611043882447 implements MigrationInterface {
    name = 'requiresActionTypo1611043882447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."return_status_enum" RENAME TO "return_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "return_status_enum" AS ENUM('requested', 'received', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "status" TYPE "return_status_enum" USING "status"::"text"::"return_status_enum"`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "status" SET DEFAULT 'requested'`);
        await queryRunner.query(`DROP TYPE "return_status_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "return"."status" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "return"."status" IS NULL`);
        await queryRunner.query(`CREATE TYPE "return_status_enum_old" AS ENUM('requested', 'received', ' requires_action')`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "status" TYPE "return_status_enum_old" USING "status"::"text"::"return_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "status" SET DEFAULT 'requested'`);
        await queryRunner.query(`DROP TYPE "return_status_enum"`);
        await queryRunner.query(`ALTER TYPE "return_status_enum_old" RENAME TO  "return_status_enum"`);
    }

}
