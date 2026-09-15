import {z} from "zod";
import {OllamaCalendarResponse} from "../contracts/OllamaCalendarResponse.js";

export class OllamaCalendarResponseValidator {
    private readonly schema = z.object({
        type: z.enum([
            "create-calendar-event",
            "needs-clarification"
        ]),

        title: z.string().nullable(),
        start: z.string().nullable(),
        durationInMinutes: z.number().positive().nullable(),
        clarificationQuestion: z.string().nullable(),
    })

    public validate(
        input: unknown,
    ): OllamaCalendarResponse {
        return this.schema.parse(input);
    }

    public getJsonSchema(): object {
        return z.toJSONSchema(this.schema);
    }
}