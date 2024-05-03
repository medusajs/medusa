export const featureFlagTemplate = ({
  key,
  description,
  defaultValue,
  envKey,
}) => {
  return `export default {
  key: "${key}",
  description: "${description}",
  default_value: ${defaultValue},
  env_key: "${envKey}",
}`
}
