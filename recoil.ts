import { atom } from "recoil";
import { calendar, event } from "./types/calendar";
import { fetchedCalendar } from "./types/googleCalendar";

export const currentCalendarAtom = atom<calendar | null>({
  key: "currentCalendarAtom",
  default: null as calendar | null,
});

export const currentEventsAtom = atom<event[]>({
  key: "currentEventsAtom",
  default: [],
});
