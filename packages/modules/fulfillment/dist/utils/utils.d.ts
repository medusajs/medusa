import { RuleOperator } from "@medusajs/utils";
/**
 * The rule engine here is kept inside the module as of now, but it could be moved
 * to the utils package and be used across the different modules that provides context
 * based rule filtering.
 *
 * TODO: discussion around that should happen at some point
 */
export type Rule = {
    attribute: string;
    operator: Lowercase<keyof typeof RuleOperator>;
    value: string | string[] | null;
};
export declare const availableOperators: RuleOperator[];
/**
 * Validate contextValue context object from contextValue set of rules.
 * By default, all rules must be valid to return true unless the option atLeastOneValidRule is set to true.
 * @param context
 * @param rules
 * @param options
 */
export declare function isContextValid(context: Record<string, any>, rules: Rule[], options?: {
    someAreValid: boolean;
}): boolean;
/**
 * Validate contextValue rule object
 * @param rule
 */
export declare function validateRule(rule: Record<string, unknown>): boolean;
export declare function normalizeRulesValue<T extends Partial<Rule>>(rules: T[]): void;
export declare function validateAndNormalizeRules<T extends Partial<Rule>>(rules: T[]): void;
/**
 * Validate contextValue set of rules
 * @param rules
 */
export declare function validateRules(rules: Record<string, unknown>[]): boolean;
