import {DateTime} from "luxon";
import {CalendarPort} from "../../../application/calendar/ports/CalendarPort.js";
import {GoogleCalendarGateway} from "./GoogleCalendarGateway.js";
import {CalendarEventCreate} from "../../../application/calendar/dto/CalendarEventCreate.js";
import {CalendarEventConflict} from "../../../application/calendar/dto/CalendarEventConflict.js";
import {CreateCalendarEventCommand} from "../../../application/calendar/commands/CreateCalendarEventCommand.js";

const TIME_ZONE = "Europe/Berlin";

export class GoogleCalendarPortAdapter implements CalendarPort {
    public constructor(
        private readonly gateway: GoogleCalendarGateway,
    ) {}

    public async findConflicts(command: CreateCalendarEventCommand): Promise<CalendarEventConflict[]> {
        const start = this.toUtcIso(command.start);
        const end = this.calculateEnd(command.start, command.durationInMinutes);

        return this.gateway.findConflicts(start, end);
    }

    public async createEvent(command: CreateCalendarEventCommand): Promise<CalendarEventCreate> {
        const start = this.toUtcIso(command.start);
        const end = this.calculateEnd(command.start, command.durationInMinutes);

        return this.gateway.createEvent(command.title, start, end);
    }

    private calculateEnd(start: string, durationInMinutes: number): string {
        return this.toBerlinTime(start).plus({minutes: durationInMinutes}).toUTC().toISO()!;
    }

    private toUtcIso(localDateTime: string): string {
        return this.toBerlinTime(localDateTime).toUTC().toISO()!;
    }

    private toBerlinTime(localDateTime: string): DateTime {
        const dateTime = DateTime.fromISO(localDateTime, {zone: TIME_ZONE});

        if (!dateTime.isValid) {
            throw new Error(`Invalid local date-time "${localDateTime}": ${dateTime.invalidReason}`);
        }

        return dateTime;
    }
}
