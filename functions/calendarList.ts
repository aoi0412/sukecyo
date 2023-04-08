import { doc, getFirestore, runTransaction } from "firebase/firestore";
import { firebaseApp } from "../firebase";
import { calendar } from "../types/calendar";
import { calendarList } from "../types/localStorage";
import { isCalendar } from "./typeCheck";

export const getCalendarListData = async (
  calendarList: calendarList
): Promise<calendar[]> => {
  const db = getFirestore(firebaseApp);
  return runTransaction(db, async (transaction) => {
    let tmpCalendarList: calendar[] = [];
    await calendarList.forEach(async (calendar) => {
      const docRef = doc(db, "calendar", calendar.id);
      await transaction.get(docRef).then((document) => {
        const data = document.data();
        if (isCalendar(data)) {
          tmpCalendarList.push(data);
        }
      });
    });
    return tmpCalendarList;
  });
};
