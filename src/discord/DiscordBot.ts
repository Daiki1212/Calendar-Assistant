import {Client, IntentsBitField, Partials, Events, Message, ChannelType} from "discord.js";
import {DiscordBotConfig} from "./DiscordBotConfig.js";
import {Assistant} from "../application/Assistant.js";

export class DiscordBot {
    private readonly client: Client

    constructor(
        private readonly discordBotConfig: DiscordBotConfig,
        private readonly assistant: Assistant,
    ) {
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.DirectMessages,
                IntentsBitField.Flags.MessageContent,
            ],
            partials: [
                Partials.Channel,
            ],
        })

        this.registerEvents();
    };

    public async start(): Promise<void> {
        await this.client.login(this.discordBotConfig.token);

        const daiki = await this.client.users.fetch(this.discordBotConfig.userId);
        await daiki.send("Ich bin Bereit!");
    }

    private registerEvents(): void {
        this.client.once(
            Events.ClientReady,
            (client) => {
                console.log("Ready! Logged in", client.user.tag);
            }
        )

        this.client.on(
            Events.MessageCreate,
            async (message) => {
                await this.handleMessage(message);
            }
        )

        this.client.on(
            Events.Error,
            (error) => {
                console.error("Discord Client Error:", error);
            }
        )
    }

    private async handleMessage(message: Message): Promise<void> {
        if (
            (message.author.bot) ||
            (message.author.id !== this.discordBotConfig.userId) ||
            (message.channel.type !== ChannelType.DM)
        ) return;

        const content = message.content.trim();
        if (!content) return;

        console.log({
            author: message.author.username,
            authorId: message.author.id,
            content: content,
        });

        const response = await this.assistant.handle(content);

        await message.reply(response);
    }
}