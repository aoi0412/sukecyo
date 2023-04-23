import { CalendarApi } from "@fullcalendar/core";
import { doc, getFirestore, setDoc, writeBatch } from "firebase/firestore";
import { firebaseApp } from "../components/utils/firebase";
import { calendar, calendarMember, event } from "../types/calendar";
import { showError } from "./error";
import { baseURL } from "../components/utils/baseURL";

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
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "calendar", id);

  setDoc(docRef, {
    id: id,
    URL: baseURL + "/calendar/" + id,
    name: calendarName ? calendarName : calendarApi.view.title,
    joinMember: joinMember ? joinMember : {},
    confirmedEvent: null,
  } as calendar)
    .then(() => {
      addEventList({
        calendarApi,
        id,
      });
    })
    .catch((error) => {
      showError({
        title: error.title,
        message: error.message,
        location: "createCalendar.ts;40",
      });
    });
};

//イベントドキュメントをFirestoreに一括作成する
export const addEventList = ({ calendarApi, id }: uploadCalendarProp) => {
  const db = getFirestore(firebaseApp);
  const batch = writeBatch(db);

  calendarApi.getEvents().forEach((event) => {
    const docRef = doc(db, "calendar", id, "events", event.id);
    const tmpJoinMember = event.extendedProps.joinMember
      ? event.extendedProps.joinMember
      : [];
    const tmpEvent: event = {
      id: event.id,
      end: event.endStr,
      joinMember: tmpJoinMember,
      start: event.startStr,
    };
    batch.set(docRef, tmpEvent);
  });
  batch.commit().catch((error) => {
    showError({
      title: error.title,
      message: error.message,
      location: "createCalendar.ts;67",
    });
  });
};
