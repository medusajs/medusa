type RuleAttributeInput = string | undefined;
export declare const ReservedPricingRuleAttributes: string[];
export declare const getInvalidRuleAttributes: (ruleAttributes: RuleAttributeInput[]) => string[];
export declare const validateRuleAttributes: (ruleAttributes: RuleAttributeInput[]) => void;
export {};
