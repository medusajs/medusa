import winston from "winston"

const consoleTransport = new winston.transports.Console({
  format: winston.format.printf((log) => log.message as string),
})
const options = {
  transports: [consoleTransport],
}

export const logger = winston.createLogger(options)
