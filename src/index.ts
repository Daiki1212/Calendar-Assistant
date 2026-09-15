import {config} from "./config.js";
import {DiscordBot} from "./discord/DiscordBot.js";
import {Assistant} from "./application/Assistant.js";
import {OllamaCalendarCommandParserAdapter} from "./infrastructure/ollama/OllamaCalendarCommandParserAdapter.js";
import {GoogleAuthClientFactory} from "./infrastructure/google/auth/GoogleAuthClientFactory.js";
import {GoogleCalendarGateway} from "./infrastructure/google/calendar/GoogleCalendarGateway.js";
import {GoogleCalendarPortAdapter} from "./infrastructure/google/calendar/GoogleCalendarPortAdapter.js";
import {ScheduleCalendarEventService} from "./application/calendar/services/ScheduleCalendarEventService.js";

async function main(): Promise<void> {
    const botConfig = config.discord;
    const ollamaParser = new OllamaCalendarCommandParserAdapter(config.ollama);

    const googleAuth = new GoogleAuthClientFactory(
        config.google.serviceAccountEmail,
        config.google.privateKey
    ).create();

    const googleGateway = new GoogleCalendarGateway(googleAuth, config.google.calendarId);
    const googleCalendar = new GoogleCalendarPortAdapter(googleGateway);
    const scheduleCalendarEventService = new ScheduleCalendarEventService(googleCalendar);

    const assistant = new Assistant(ollamaParser, scheduleCalendarEventService);

    const bot = new DiscordBot(botConfig, assistant)

    await bot.start();
}

main().catch((error) => {
    console.error("Error starting Discord bot:", error)
    process.exit(1);
});