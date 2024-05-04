"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePostgresAlterColummnIfExistStatement = void 0;
function generatePostgresAlterColummnIfExistStatement(tableName, columns, alterExpression) {
    var script = "\n    DO $$\n    DECLARE\n        current_column text;\n    BEGIN";
    columns.forEach(function (column) {
        script += "\n        current_column := '".concat(column, "';\n        IF EXISTS (\n            SELECT 1 \n            FROM information_schema.columns \n            WHERE table_name = '").concat(tableName, "' \n            AND column_name = current_column\n        ) THEN\n            EXECUTE format('ALTER TABLE %I ALTER COLUMN %I ").concat(alterExpression, "', '").concat(tableName, "', current_column);\n        ELSE\n            RAISE NOTICE 'Column % does not exist or alteration condition not met.', current_column;\n        END IF;");
    });
    script += "\n    END$$;\n    ";
    return script;
}
exports.generatePostgresAlterColummnIfExistStatement = generatePostgresAlterColummnIfExistStatement;
//# sourceMappingURL=alter-columns-helper.js.map