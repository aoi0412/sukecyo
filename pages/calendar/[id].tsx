/* eslint-disable react-hooks/rules-of-hooks */
import FullCalendar from "@fullcalendar/react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { firebaseApp } from "../../firebase";
import { calendar } from "../../types/calendar";
import timegridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Link from "next/link";
import { calcRateOfMember } from "../../functions/calendar";

const calendarPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [calendarData, setCalendarData] = useState<calendar | null>(null);
  useEffect(() => {
    console.log(id);
    if (typeof id === "string") {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, "calendar", id);
      getDoc(docRef).then((doc) => {
        const docData = doc.data() as calendar;
        setCalendarData(docData);
        console.log("docData is", docData);
      });
    }
  }, [id]);
  return (
    <div>
      <p>{id}</p>
      <Link href={`http://localhost:3000/joinCalendar/${id}`}>join</Link>
      <p>
        joinMember:{calendarData && Object.keys(calendarData.joinMember).length}
      </p>
      <div>
        {calendarData?.events
          .sort((a, b) => {
            return a.joinMember.length < b.joinMember.length ? 1 : -1;
          })
          .map((event) => (
            <div key={event.id}>
              <p>{event.id.toString()}</p>
              <p>
                rate:
                {calcRateOfMember({
                  joinMember: event.joinMember,
                  allMember: calendarData.joinMember,
                })}
              </p>
            </div>
          ))}
      </div>
      <FullCalendar
        plugins={[timegridPlugin]}
        events={calendarData?.events}
        headerToolbar={{
          right: "timeGridWeek",
        }}
        eventContent={(contentInfo) => {
          console.log("content is", contentInfo.event.extendedProps.joinMember);
          return (
            <div>
              {contentInfo.event.extendedProps.joinMember.map(
                (name: string, index: number) => (
                  <p key={index}>{calendarData?.joinMember[name]}</p>
                )
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default calendarPage;
