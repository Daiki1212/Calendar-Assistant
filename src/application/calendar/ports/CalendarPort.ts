import {CreateCalendarEventCommand} from "../commands/CreateCalendarEventCommand.js";
import {CalendarEventConflict} from "../dto/CalendarEventConflict.js";
import {CalendarEventCreate} from "../dto/CalendarEventCreate.js";

export interface CalendarPort {
    createEvent(command: CreateCalendarEventCommand): Promise<CalendarEventCreate>;
    findConflicts(command: CreateCalendarEventCommand): Promise<CalendarEventConflict[]>;
}
