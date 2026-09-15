import 'dotenv/config';

function getRequiredEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
}

function getOptionalEnv(key: string, fallback: string): string {
    return process.env[key] ?? fallback;
}

export const config = {
    discord: {
        token: getRequiredEnv('DISCORD_TOKEN'),
        userId: getRequiredEnv('DISCORD_USER_ID'),
    },
    ollama: {
        host: getOptionalEnv('OLLAMA_HOST', 'http://localhost:11434'),
        model: getOptionalEnv('OLLAMA_MODEL', 'qwen3:8b'),
    },
    google: {
        serviceAccountEmail: getRequiredEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        privateKey: getRequiredEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        calendarId: getRequiredEnv('GOOGLE_CALENDAR_ID'),
    }
}