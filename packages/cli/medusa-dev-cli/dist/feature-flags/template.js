"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureFlagTemplate = void 0;
const featureFlagTemplate = ({ key, description, defaultValue, envKey, }) => {
    return `export default {
  key: "${key}",
  description: "${description}",
  default_value: ${defaultValue},
  env_key: "${envKey}",
}`;
};
exports.featureFlagTemplate = featureFlagTemplate;
//# sourceMappingURL=template.js.map