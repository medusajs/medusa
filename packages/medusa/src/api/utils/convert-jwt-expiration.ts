export function convertJwtExpiration(expiresIn: string) {
    const units = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 24 * 60 * 60,
    };
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));
    return value * units[unit];
}