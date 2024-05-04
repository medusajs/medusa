/**
 * @typedef MedusaErrorType
 *
 */
export declare const MedusaErrorTypes: {
    /** Errors stemming from the database */
    DB_ERROR: string;
    DUPLICATE_ERROR: string;
    INVALID_ARGUMENT: string;
    INVALID_DATA: string;
    UNAUTHORIZED: string;
    NOT_FOUND: string;
    NOT_ALLOWED: string;
    UNEXPECTED_STATE: string;
    CONFLICT: string;
    PAYMENT_AUTHORIZATION_ERROR: string;
};
export declare const MedusaErrorCodes: {
    INSUFFICIENT_INVENTORY: string;
    CART_INCOMPATIBLE_STATE: string;
};
/**
 * Standardized error to be used across Medusa project.
 * @extends Error
 */
export declare class MedusaError extends Error {
    type: string;
    message: string;
    code?: string;
    date: Date;
    static Types: {
        /** Errors stemming from the database */
        DB_ERROR: string;
        DUPLICATE_ERROR: string;
        INVALID_ARGUMENT: string;
        INVALID_DATA: string;
        UNAUTHORIZED: string;
        NOT_FOUND: string;
        NOT_ALLOWED: string;
        UNEXPECTED_STATE: string;
        CONFLICT: string;
        PAYMENT_AUTHORIZATION_ERROR: string;
    };
    static Codes: {
        INSUFFICIENT_INVENTORY: string;
        CART_INCOMPATIBLE_STATE: string;
    };
    /**
     * Creates a standardized error to be used across Medusa project.
     * @param {string} type - type of error
     * @param {string} message - message to go along with error
     * @param {string} code - code of error
     * @param {Array} params - params
     */
    constructor(type: string, message: string, code?: string, ...params: any);
}
