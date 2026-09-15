import {CalendarCommandParser} from "./calendar/ports/CalendarCommandParser.js";
import {NeedsClarificationCommand} from "./calendar/commands/NeedsClarificationCommand.js";
import {CreateCalendarEventCommand} from "./calendar/commands/CreateCalendarEventCommand.js";
import {ScheduleCalendarEventService} from "./calendar/services/ScheduleCalendarEventService.js";
import {CalendarEventConflictResult} from "./calendar/results/CalendarEventConflictResult.js";
import {CalendarResponsePresenter} from "./calendar/presenters/CalendarResponsePresenter.js";

export class Assistant {
    private readonly calendarResponsePresenter = new CalendarResponsePresenter();

    public constructor(
        private readonly calendarCommandParser: CalendarCommandParser,
        private readonly scheduleCalendarEventService: ScheduleCalendarEventService,
    ) {}

    public async handle(input: string): Promise<string> {
        try{
            const command = await this.calendarCommandParser.parse(input);

            if (command instanceof NeedsClarificationCommand) {
                return command.question;
            }

            if (command instanceof CreateCalendarEventCommand) {
                const result = await this.scheduleCalendarEventService.execute(command);

                if ( result instanceof CalendarEventConflictResult ) {
                    return this.calendarResponsePresenter.presentConflict(result.conflicts);
                }

                return this.calendarResponsePresenter.presentCreated(result);
            }

            throw new Error("Unbekannter Command", {cause: command});
        } catch (error) {
            console.error("Error handling command:", error);
            return "Ich habe etwas schief gelaufen. Bitte versuche es erneut.";
        }
    }
}