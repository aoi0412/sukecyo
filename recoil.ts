import { atom } from "recoil";
import { calendar, event } from "./types/calendar";

export const currentCalendarAtom = atom({
  key: "currentCalendarAtom",
  default: null as calendar | null,
});

export const currentEventsAtom = atom({
  key: "currentEventsAtom",
  default: [] as event[],
});
