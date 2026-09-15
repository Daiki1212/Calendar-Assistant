export interface OllamaCalendarResponse {
    type: "create-calendar-event" | "needs-clarification";
    title: string | null;
    start: string | null;
    durationInMinutes: number | null;
    clarificationQuestion: string | null;
}