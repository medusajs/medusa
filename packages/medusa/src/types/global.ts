import { AwilixContainer } from "awilix"
import { Logger as _Logger } from "winston"

export type ClassConstructor<T> = {
    new (...args: any[]): T;
};

export type MedusaContainer = AwilixContainer & { registerAdd: (name: string, registration: unknown ) => MedusaContainer }

export type Logger = _Logger & { progress: (activityId: string, msg: string) => void }