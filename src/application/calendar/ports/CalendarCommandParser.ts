import {CalendarCommand} from "../dto/CalendarCommand.js";

export interface CalendarCommandParser {
    parse(input: string): Promise<CalendarCommand>
}
