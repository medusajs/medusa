import type { Error } from "./Error";
export interface MultipleErrors {
    /**
     * Array of errors
     */
    errors?: Array<Error>;
    message?: string;
}
