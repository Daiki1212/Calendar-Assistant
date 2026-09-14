import 'dotenv/config';

function getRequiredEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
}

export const config = {
    discord: {
        token: getRequiredEnv('DISCORD_TOKEN'),
        userId: getRequiredEnv('DISCORD_USER_ID'),
    }
}