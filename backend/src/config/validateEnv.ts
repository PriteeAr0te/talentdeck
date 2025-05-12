export const requireEnv = (key: string) => {
    const value = process.env[key];
    if(!value) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value;
}