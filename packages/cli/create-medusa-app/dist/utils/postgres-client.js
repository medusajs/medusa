import pg from "pg";
const { Client } = pg;
export default async (connect) => {
    const client = new Client(connect);
    await client.connect();
    return client;
};
