import { doc, getFirestore, runTransaction } from "firebase/firestore";
import { firebaseApp } from "../components/utils/firebase";
import { calendar } from "../types/calendar";
import { calendarList } from "../types/localStorage";
import { isCalendar } from "./typeCheck";

export const getCalendarListData = async (calendarList: calendarList) => {
  let tmpCalendarList: calendar[] = [];
  const db = getFirestore(firebaseApp);
  await runTransaction(db, async (transaction) => {
    for (const calendar of calendarList) {
      console.log("calendar is", calendar);
      const docRef = doc(db, "calendar", calendar.id);
      await transaction.get(docRef).then((document) => {
        console.log("getDoc is", calendar);
        const data = document.data();
        if (isCalendar(data)) {
          tmpCalendarList.push(data);
        }
      });
    }
    return tmpCalendarList;
  });
  console.log("Transaction successfully committed!");
  return tmpCalendarList;
};
