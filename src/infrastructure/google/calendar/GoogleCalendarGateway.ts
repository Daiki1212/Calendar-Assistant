import {calendar_v3, google} from "googleapis";
import {JWT} from "google-auth-library";
import {CalendarEventCreate} from "../../../application/calendar/dto/CalendarEventCreate.js";
import {CalendarEventConflict} from "../../../application/calendar/dto/CalendarEventConflict.js";

export class GoogleCalendarGateway {
    private readonly calendar: calendar_v3.Calendar;

    public constructor(
        authClient: JWT,
        private readonly calendarId: string,
    ) {
        this.calendar = google.calendar({version: 'v3', auth: authClient});
    }

    public async findConflicts(start: string, end: string): Promise<CalendarEventConflict[]> {
        const response = await this.calendar.events.list({
            calendarId: this.calendarId,
            timeMin: start,
            timeMax: end,
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 10,
        });

        return (response.data.items ?? [])
          .map(event => ({
            title:
              event.summary ??
              "Unbenannter Termin",

            start:
              event.start?.dateTime ??
              event.start?.date ??
              "",

            end:
              event.end?.dateTime ??
              event.end?.date ??
              "",
        }));
    }

    public async createEvent(title: string, start: string, end: string): Promise<CalendarEventCreate> {
        const response = await this.calendar.events.insert({
            calendarId: this.calendarId,
            requestBody: {
                summary: title,
                start: {dateTime: start},
                end: {dateTime: end},
            },
        })

        const event = response.data;
        return {
            id: event.id ?? "",
            title: event.summary ?? title,
            start: event.start?.dateTime ?? start,
            end: event.end?.dateTime ?? end,
            externalUrl: event.htmlLink ?? null,
        };
    }
}