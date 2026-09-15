import {CalendarEventConflict} from "../dto/CalendarEventConflict.js";

export class CalendarEventConflictResult {
  public constructor(
    public readonly conflicts: CalendarEventConflict[],
  ) {}
}