import { MigrationInterface, QueryRunner } from "typeorm"
import { countries } from "../utils/countries"
import { currencies } from "../utils/currencies"

export class countriesCurrencies1611063174563 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const c of countries) {
      const query = `INSERT INTO "country" ("iso_2", "iso_3", "num_code", "name", "display_name") VALUES ($1, $2, $3, $4, $5)`

      const iso2 = c.alpha2.toLowerCase()
      const iso3 = c.alpha3.toLowerCase()
      const numeric = c.numeric
      const name = c.name.toUpperCase()
      const display = c.name

      await queryRunner.query(query, [iso2, iso3, numeric, name, display])
    }

    for (const [_, c] of Object.entries(currencies)) {
      const query = `INSERT INTO "currency" ("code", "symbol", "symbol_native", "name") VALUES ($1, $2, $3, $4)`

      const code = c.code.toLowerCase()
      const sym = c.symbol
      const nat = c.symbol_native
      const name = c.name

      await queryRunner.query(query, [code, sym, nat, name])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const c of countries) {
      await queryRunner.query(
        `DELETE FROM "country" WHERE iso_2 = '${c.alpha2}'`
      )
    }

    for (const [_, c] of Object.entries(currencies)) {
      await queryRunner.query(
        `DELETE FROM "currency" WHERE code = '${c.code.toLowerCase()}'`
      )
    }
  }
}
