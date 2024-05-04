export function encodeDbValue(value) {
    return encodeURIComponent(value);
}
export default ({ user, password, host, db }) => {
    let connection = `postgres://`;
    if (user) {
        connection += encodeDbValue(user);
    }
    if (password) {
        connection += `:${encodeDbValue(password)}`;
    }
    if (user || password) {
        connection += "@";
    }
    connection += `${host}/${db}`;
    return connection;
};
