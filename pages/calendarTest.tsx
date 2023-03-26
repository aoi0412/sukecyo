/* eslint-disable react-hooks/rules-of-hooks */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ScrollableCalendar from "../components/ScrollableCalendar";
import { firebaseApp } from "../firebase";
import { calendar } from "../types/calendar";

const calendarTest = () => {
  const [events, setEvents] = useState<EventSource[]>([]);
  useEffect(() => {
    const firebase = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const col = doc(db, "calendar", "calendarID");
        getDoc(col).then((doc) => {
          setEvents((doc.data() as calendar).events);
        });
        // setData(ret);
      } catch (error) {
        console.log("error", error);
      }
    };
    firebase();
  }, []);
  return (
    <div>
      <ScrollableCalendar events={events} />
    </div>
  );
};

export default calendarTest;
