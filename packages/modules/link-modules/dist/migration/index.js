"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMigration = void 0;
const utils_1 = require("../utils");
const utils_2 = require("@medusajs/utils");
function getMigration(joinerConfig, serviceName, primary, foreign) {
    return async function runMigrations({ options, logger, } = {}) {
        logger ?? (logger = console);
        const dbData = utils_2.ModulesSdkUtils.loadDatabaseConfig("link_modules", options);
        const entity = (0, utils_1.generateEntity)(joinerConfig, primary, foreign);
        const pathToMigrations = __dirname + "/../migrations";
        const orm = await utils_2.DALUtils.mikroOrmCreateConnection(dbData, [entity], pathToMigrations);
        const tableName = entity.meta.collection;
        let hasTable = false;
        try {
            await orm.em.getConnection().execute(`SELECT 1 FROM ${tableName} LIMIT 0`);
            hasTable = true;
        }
        catch { }
        const generator = orm.getSchemaGenerator();
        if (hasTable) {
            /* const updateSql = await generator.getUpdateSchemaSQL()
            const entityUpdates = updateSql
              .split(";")
              .map((sql) => sql.trim())
              .filter((sql) =>
                sql.toLowerCase().includes(`alter table "${tableName.toLowerCase()}"`)
              )
      
            if (entityUpdates.length > 0) {
              try {
                await generator.execute(entityUpdates.join(";"))
                logger.info(`Link module "${serviceName}" migration executed`)
              } catch (error) {
                logger.error(
                  `Link module "${serviceName}" migration failed to run - Error: ${error}`
                )
              }
            } else {
              logger.info(`Skipping "${tableName}" migration.`)
            }*/
            logger.info(`Link module "${serviceName}" table update skipped because the table already exists. Please write your own migration if needed.`);
        }
        else {
            try {
                await generator.createSchema();
                logger.info(`Link module "${serviceName}" migration executed`);
            }
            catch (error) {
                logger.error(`Link module "${serviceName}" migration failed to run - Error: ${error}`);
            }
        }
        await orm.close();
    };
}
exports.getMigration = getMigration;
