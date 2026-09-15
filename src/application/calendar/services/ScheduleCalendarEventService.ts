import {CalendarPort} from "../ports/CalendarPort.js";
import {CreateCalendarEventCommand} from "../commands/CreateCalendarEventCommand.js";
import {CalendarEventConflictResult} from "../results/CalendarEventConflictResult.js";
import {CalendarEventCreateResult} from "../results/CalendarEventCreateResult.js";

export class ScheduleCalendarEventService {
    public constructor(
        private readonly calendarPort: CalendarPort
    ) {}

    public async execute(command: CreateCalendarEventCommand): Promise<CalendarEventConflictResult | CalendarEventCreateResult> {
        const conflicts = await this.calendarPort.findConflicts(command);

        if (conflicts.length > 0) {
            return new CalendarEventConflictResult(conflicts);
        }

        const event = await this.calendarPort.createEvent(command);

        return new CalendarEventCreateResult(event);
    }
}