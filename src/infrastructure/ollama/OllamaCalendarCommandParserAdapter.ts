import {Ollama} from "ollama";
import {OllamaCalendarResponseValidator} from "./validators/OllamaCalendarResponseValidator.js";
import {OllamaCalendarCommandParserOptions} from "./contracts/OllamaCalendarCommandParserOptions.js";
import {OllamaCalendarResponse} from "./contracts/OllamaCalendarResponse.js";
import {NeedsClarificationCommand} from "../../application/calendar/commands/NeedsClarificationCommand.js";
import {CreateCalendarEventCommand} from "../../application/calendar/commands/CreateCalendarEventCommand.js";
import {CalendarCommand} from "../../application/calendar/dto/CalendarCommand.js";
import {CalendarCommandParser} from "../../application/calendar/ports/CalendarCommandParser.js";

export class OllamaCalendarCommandParserAdapter implements CalendarCommandParser {
    private readonly client: Ollama
    private readonly responseValidator: OllamaCalendarResponseValidator

    public constructor(
        private readonly options: OllamaCalendarCommandParserOptions,
    ) {
        this.client = new Ollama({
            host: options.host,
        })

        this.responseValidator = new OllamaCalendarResponseValidator();
    }

    public async parse(input: string): Promise<CalendarCommand> {

        const response = await this.client.chat({
            model: this.options.model,
            stream: false,
            messages: [
                {
                    role: "system",
                    content: this.createSystemPrompt(),
                },
                {
                    role: "user",
                    content: input,
                }
            ],
            format: this.responseValidator.getJsonSchema(),
            options: {
                temperature: 0,
            }
        });

        const json: unknown = JSON.parse(response.message.content);
        const result: OllamaCalendarResponse = this.responseValidator.validate(json);

        if ( result.type === "needs-clarification" ) {
            return new NeedsClarificationCommand(result.clarificationQuestion ?? "Ich brauche weitre Infos.");
        }

        if (!result.title || !result.start || !result.durationInMinutes) {
            return new NeedsClarificationCommand("Datum, Uhrzeit oder Dauer des Termins sind nicht eindeutig.")
        }

        return new CreateCalendarEventCommand(
            result.title,
            result.start,
            result.durationInMinutes,
        )
    }

    private createSystemPrompt(): string {
        return `
             You extract Calendar events from German Natural Language.
             
             Current Date: ${new Date().toISOString()}
             
             Timezone: Europe/Berlin
             
             Your task is ONLY to extract structured calendar Information.
             You never execute Actions.
             Supported Operations:
             - create-calendar-event
             - needs-clarification
             
             Rules:
             1. Never Invent missing Informations
             2. A Cleander Event Requires:
                 - title
                 - date
                 - start
                 - durationInMinutes
             3. If Required Information is missing, return "needs-clarification"
             4. "start" must use the format: YYYY-MM-DDTHH:mm:ss
             5. "start" must NOT contain a timezone, UTC marker or offset.
             6. If a date has a missing a Year assume the next occurence of that date
             7. Resolve relative dates using the current date.
             8. A Default Duration is 60 Minutes
             
             Example 1.:
             Input:
             1.1 19 Uhr 3 Stunden raid alli
             
             Output:
             {
                "type": "create-calendar-event",
                "title": "Raid Alli",
                "start": "2027-01-19T19:00:00",
                "durationInMinutes": 180
                "clarificationQuestion": null
            }
            
            Example 2.:
            Input:
            morgen Raid
            
            Output:
            {
                "type": "needs-clarification",
                "title": "Raid",
                "start": null,
                "durationInMinutes": 60,
                "question": "Um wieviel Uhr beginnt der Raid?"
            }
       `.trim();
    }
}