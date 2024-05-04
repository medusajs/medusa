import { EOL } from "os";
import postgresClient from "./postgres-client.js";
import inquirer from "inquirer";
import logMessage from "./log-message.js";
import formatConnectionString from "./format-connection-string.js";
import { getCurrentOs } from "./get-current-os.js";
export default async function createDb({ client, db }) {
    await client.query(`CREATE DATABASE "${db}"`);
}
export async function runCreateDb({ client, dbName, spinner, }) {
    let newClient = client;
    try {
        // create postgres database
        await createDb({
            client,
            db: dbName,
        });
        // create a new connection with database selected
        await client.end();
        newClient = await postgresClient({
            user: client.user,
            password: client.password,
            database: dbName,
        });
    }
    catch (e) {
        spinner.stop();
        logMessage({
            message: `An error occurred while trying to create your database: ${e}`,
            type: "error",
        });
    }
    return newClient;
}
async function getForDbName({ dbName, verbose = false, }) {
    let client;
    let postgresUsername = "postgres";
    let postgresPassword = "";
    try {
        client = await postgresClient({
            user: postgresUsername,
            password: postgresPassword,
        });
    }
    catch (e) {
        if (verbose) {
            logMessage({
                message: `The following error occured when connecting to the database: ${e}`,
                type: "verbose",
            });
        }
        // ask for the user's postgres credentials
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "postgresUsername",
                message: "Enter your Postgres username",
                default: "postgres",
                validate: (input) => {
                    return typeof input === "string" && input.length > 0;
                },
            },
            {
                type: "password",
                name: "postgresPassword",
                message: "Enter your Postgres password",
            },
        ]);
        postgresUsername = answers.postgresUsername;
        postgresPassword = answers.postgresPassword;
        try {
            client = await postgresClient({
                user: postgresUsername,
                password: postgresPassword,
            });
        }
        catch (e) {
            logMessage({
                message: `Couldn't connect to PostgreSQL because of the following error: ${e}.${EOL}${EOL}Make sure you have PostgreSQL installed and the credentials you provided are correct.${EOL}${EOL}You can learn how to install PostgreSQL here: https://docs.medusajs.com/development/backend/prepare-environment?os=${getCurrentOs()}#postgresql${EOL}${EOL}If you keep running into this issue despite having PostgreSQL installed, please check out our troubleshooting guidelines: https://docs.medusajs.com/troubleshooting/database-error`,
                type: "error",
            });
        }
    }
    // format connection string
    const dbConnectionString = formatConnectionString({
        user: postgresUsername,
        password: postgresPassword,
        host: client.host,
        db: dbName,
    });
    return {
        client,
        dbConnectionString,
    };
}
async function getForDbUrl({ dbUrl, verbose = false, }) {
    let client;
    try {
        client = await postgresClient({
            connectionString: dbUrl,
        });
    }
    catch (e) {
        if (verbose) {
            logMessage({
                message: `The following error occured when connecting to the database: ${e}`,
                type: "verbose",
            });
        }
        logMessage({
            message: `Couldn't connect to PostgreSQL using the database URL you passed. Make sure it's correct and try again.`,
            type: "error",
        });
    }
    return {
        client,
        dbConnectionString: dbUrl,
    };
}
export async function getDbClientAndCredentials({ dbName = "", dbUrl = "", verbose = false, }) {
    if (dbName) {
        return await getForDbName({
            dbName,
            verbose,
        });
    }
    else {
        return await getForDbUrl({
            dbUrl,
            verbose,
        });
    }
}
