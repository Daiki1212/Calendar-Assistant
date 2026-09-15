import {CalendarEventCreate} from "../dto/CalendarEventCreate.js";

export class CalendarEventCreateResult {
    public constructor(
        public readonly event: CalendarEventCreate,
    ) {}
}