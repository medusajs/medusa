/**
 * Converts a structure of find options to an
 * array of string paths
 * @example
 * // With `includeTruePropertiesOnly` default value set to false
 * const result = objectToStringPath({
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * })
 * console.log(result)
 * // output: ['test', 'test.test1', 'test.test2', 'test.test3', 'test.test3.test4', 'test2']
 *
 * @example
 * // With `includeTruePropertiesOnly` set to true
 * const result = objectToStringPath({
 *   test: {
 *     test1: true,
 *     test2: true,
 *     test3: {
 *       test4: true
 *     },
 *   },
 *   test2: true
 * }, {
 *   includeTruePropertiesOnly: true
 * })
 * console.log(result)
 * // output: ['test.test1', 'test.test2', 'test.test3.test4', 'test2']
 *
 * @param {InputObject} input
 * @param {boolean} includeParentPropertyFields If set to true (example 1), all properties will be included as well as the parents,
 * otherwise (example 2) all properties path set to true will included, excluded the parents
 */
export declare function objectToStringPath(input?: object, { includeParentPropertyFields }?: {
    includeParentPropertyFields: boolean;
}): string[];
