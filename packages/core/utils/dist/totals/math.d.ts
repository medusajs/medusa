import { BigNumberInput } from "@medusajs/types";
import { BigNumber as BigNumberJS } from "bignumber.js";
import { BigNumber } from "./big-number";
type BNInput = BigNumberInput | BigNumber;
export declare class MathBN {
    static convert(num: BNInput): BigNumberJS;
    static add(...nums: BNInput[]): BigNumberJS;
    static sum(...nums: BNInput[]): BigNumberJS;
    static sub(...nums: BNInput[]): BigNumberJS;
    static mult(n1: BNInput, n2: BNInput): BigNumberJS;
    static div(n1: BNInput, n2: BNInput): BigNumberJS;
    static abs(n: BNInput): BigNumberJS;
    static mod(n1: BNInput, n2: BNInput): BigNumberJS;
    static exp(n: BNInput, exp?: number): BigNumberJS;
    static min(...nums: BNInput[]): BigNumberJS;
    static max(...nums: BNInput[]): BigNumberJS;
    static gt(n1: BNInput, n2: BNInput): boolean;
    static gte(n1: BNInput, n2: BNInput): boolean;
    static lt(n1: BNInput, n2: BNInput): boolean;
    static lte(n1: BNInput, n2: BNInput): boolean;
    static eq(n1: BNInput, n2: BNInput): boolean;
}
export {};
