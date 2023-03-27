import { CalendarApi } from "@fullcalendar/core";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../firebase";
import { calendar, calendarMember, event } from "../types/calendar";
import { saveCalendarList } from "./localStorage";

type uploadCalendarProp = {
  calendarApi: CalendarApi;
  calendarName?: string;
  id: string;
  joinMember?: calendarMember;
};
export const uploadCalendar = ({
  calendarApi,
  calendarName,
  id,
  joinMember,
}: uploadCalendarProp) => {
  const baseURL = "http://localhost:3000/calendar/";
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "calendar", id);
  const events: event[] = [];
  calendarApi.getEvents().forEach((event) => {
    const tmpJoinMember = event.extendedProps.joinMember
      ? event.extendedProps.joinMember
      : [];
    const tmpEvent: event = {
      id: event.id,
      end: event.endStr,
      joinMember: tmpJoinMember,
      start: event.startStr,
    };
    events.push(tmpEvent);
  });
  setDoc(docRef, {
    id: id,
    URL: baseURL + id,
    name: calendarName ? calendarName : calendarApi.view.title,
    events: events,
    joinMember: joinMember ? joinMember : {},
  } as calendar);
};
