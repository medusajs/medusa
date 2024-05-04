"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutionRepository = void 0;
const utils_1 = require("@medusajs/utils");
const _models_1 = require("../models");
// eslint-disable-next-line max-len
class WorkflowExecutionRepository extends utils_1.DALUtils.mikroOrmBaseRepositoryFactory(_models_1.WorkflowExecution) {
}
exports.WorkflowExecutionRepository = WorkflowExecutionRepository;
