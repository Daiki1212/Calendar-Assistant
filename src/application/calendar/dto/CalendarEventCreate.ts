export interface CalendarEventCreate {
  readonly id: string;
  readonly title: string;
  readonly start: string;
  readonly end: string;
  readonly externalUrl: string | null;
}