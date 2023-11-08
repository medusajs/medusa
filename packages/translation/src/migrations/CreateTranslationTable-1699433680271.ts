import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTranslationTable1699433680271 implements MigrationInterface {
  name = "CreateTranslationTable1699433680271"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "translation"
        (
            "id"          text        NOT NULL,
            "created_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "lang"        text        NOT NULL,
            "attributes"  jsonb                    NOT NULL,
            CONSTRAINT "PK_translation_id" PRIMARY KEY ("id")
        );
        CREATE INDEX IF NOT EXISTS "IDX_translation_lang" ON "translation" ("lang");
        CREATE INDEX IF NOT EXISTS "IDX_translation_attributes" ON "translation" USING GIN ("attributes");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "translation";
        DROP INDEX IF EXISTS "IDX_translation_lang";
        DROP INDEX IF EXISTS "IDX_translation_attributes";
    `)
  }
}
