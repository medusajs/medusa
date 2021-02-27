import {MigrationInterface, QueryRunner} from "typeorm";

export class trackingLinks1613656135167 implements MigrationInterface {
    name = 'trackingLinks1613656135167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracking_link" ("id" character varying NOT NULL, "url" character varying, "tracking_number" character varying NOT NULL, "fulfillment_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, "idempotency_key" character varying, CONSTRAINT "PK_fcfd77feb9012ec2126d7c0bfb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tracking_link" ADD CONSTRAINT "FK_471e9e4c96e02ba209a307db32b" FOREIGN KEY ("fulfillment_id") REFERENCES "fulfillment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracking_link" DROP CONSTRAINT "FK_471e9e4c96e02ba209a307db32b"`);
        await queryRunner.query(`DROP TABLE "tracking_link"`);
    }

}
