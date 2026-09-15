import {CalendarCommand} from "../dto/CalendarCommand.js";

export class NeedsClarificationCommand implements CalendarCommand {
    public readonly type = "needs-clarification";

    constructor(
        public readonly question: string,
    ) {}
}