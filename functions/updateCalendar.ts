import { CalendarApi } from "@fullcalendar/core";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firebaseApp } from "../components/utils/firebase";
import { event, eventForJoin } from "../types/calendar";
import { showError } from "./error";

type updateCalendarJoinMemberProp = {
  eventData: eventForJoin[];
  id: string;
  memberName: string;
  memberId: string;
};
export const updateCalendarJoinMember = async ({
  eventData,
  id,
  memberName,
  memberId,
}: updateCalendarJoinMemberProp) => {
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "calendar", id);

  return await updateDoc(docRef, {
    [`joinMember.${memberId}`]: memberName,
  })
    .then(() => {
      updateEventMemberList({
        eventData,
        id,
        memberId,
      }).catch((error) => {
        console.log("updateCalendar,37", error);
        showError({
          title: error.title,
          message: error.message,
          location: "updateCalendar.ts;42",
        });
      });
    })
    .catch((error) => {
      showError({
        title: error.title,
        message: error.message,
        location: "updateCalendar.ts;50",
      });
    });
  1;
};

//イベントドキュメントをFirestoreに一括作成する
export const updateEventMemberList = async ({
  id,
  memberId,
  eventData,
}: {
  eventData: eventForJoin[];
  id: string;
  memberId: string;
}) => {
  const db = getFirestore(firebaseApp);
  const batch = writeBatch(db);

  eventData.forEach((event) => {
    console.log("eventsssssss", event);
    const docRef = doc(db, "calendar", id, "events", event.event.id);
    console.log("event change", event);
    if (event.isSelected) {
      batch.update(docRef, {
        joinMember: arrayUnion(memberId),
      });
    } else {
      batch.update(docRef, {
        joinMember: arrayRemove(memberId),
      });
    }
  });
  return await batch.commit();
};

export const confirmEvents = ({
  event,
  id,
}: {
  event: event | null;
  id: string;
}) => {
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "calendar", id);
  updateDoc(docRef, {
    confirmedEvent: event,
  });
};
