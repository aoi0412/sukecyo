import { join } from "path";

export type calendar = {
  name: string;
  id: string;
  URL: string;
  events: event[];
  joinMember: calendarMember;
  confirmedEvent: null | event;
};
export type event = {
  id: string;
  end: string;
  joinMember: string[];
  start: string;
};

export type calendarMember = { [memberId: string]: string };
