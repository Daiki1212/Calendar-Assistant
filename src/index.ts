import {config} from "./config.js";
import {DiscordBot} from "./discord/DiscordBot.js";

async function main(): Promise<void> {
    const bot = new DiscordBot({
        token: config.discord.token,
        userId: config.discord.userId,
    })

    await bot.start();
}

main().catch((error) => {
    console.error("Error starting Discord bot:", error)
    process.exit(1);
});