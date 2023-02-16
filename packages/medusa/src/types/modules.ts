/**
 * @schema ModulesResponse
 * type: array
 * items:
 *   type: object
 *   required:
 *     - module
 *     - resolution
 *   properties:
 *     module:
 *       description: The key of the module.
 *       type: string
 *     resolution:
 *       description: The resolution path of the module or false if module is not installed.
 *       type: string
 */
export type ModulesResponse = {
  module: string
  resolution: string | false
}[]
