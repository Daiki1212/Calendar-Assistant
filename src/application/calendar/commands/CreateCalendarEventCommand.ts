import {CalendarCommand} from "../dto/CalendarCommand.js";

export class CreateCalendarEventCommand implements CalendarCommand {
    public readonly type = "create-calendar-event";

    constructor(
        public readonly title: string,
        public readonly start: string,
        public readonly durationInMinutes: number,
    ) {}
}