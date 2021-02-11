import {MigrationInterface, QueryRunner} from "typeorm";

export class notifications11613037267702 implements MigrationInterface {
    name = 'notifications11613037267702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "event_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "event_name"`);
    }

}
