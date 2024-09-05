import { z } from "zod";

const int = (params?: ({
    errorMap?: z.ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => z.number(params).refine((v) => Number.isInteger(v), {
        message: "Value must be an integer",
    })

const field = {
    ...z,
    int,
}