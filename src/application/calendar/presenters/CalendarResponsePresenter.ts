import {CalendarEventConflict} from "../dto/CalendarEventConflict.js";
import {CalendarEventCreateResult} from "../results/CalendarEventCreateResult.js";

export class CalendarResponsePresenter {
    public presentConflict(conflicts: CalendarEventConflict[]): string {
        const formattedConflicts = conflicts
            .map(conflict => `**${conflict.title}** - ${conflict.start} bis ${conflict.end}`)
            .join("\n");

        return `
**Terminkonflikt**
${formattedConflicts}

__**Der Termin wurde nicht eingetragen.**__
`;
    }

    public presentCreated(result: CalendarEventCreateResult): string {
        return `
**Termin eingetragen**

**${result.event.title}**
**Start: ${result.event.start}**
**Ende: ${result.event.end}**
`;
    }
}
