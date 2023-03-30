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
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { uploadCalendar } from "../../functions/calendar";
import timegrid from "@fullcalendar/timegrid";

const calendarPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [memberId, setMemberId] = useState<string>(
    new Date().getTime().toString()
  );
  const [calendarData, setCalendarData] = useState<calendar | null>(null);
  const [memberName, setMemberName] = useState<string>("");
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
  const handleEventSelect = (selectionInfo: EventClickArg) => {
    console.log("selectionInfo: ", selectionInfo); // 選択した範囲の情報をconsoleに出力
    const eventData = selectionInfo.view.calendar.getEventById(
      selectionInfo.event.id
    );
    if (eventData) {
      let tmpJoinMember: string[] = eventData.extendedProps.joinMember;
      if (tmpJoinMember.find((member) => member === memberId)) {
        tmpJoinMember = tmpJoinMember.filter((member) => member !== memberId);
      } else {
        tmpJoinMember.push(memberId);
      }
      eventData.setExtendedProp("joinMember", tmpJoinMember);
    }
  };
  const calendarRef = useRef<FullCalendar>(null!);

  if (typeof id !== "string") return <></>;
  return (
    <div>
      <input
        value={memberName}
        onChange={(e) => setMemberName(e.currentTarget.value)}
      />
      <button
        onClick={() => {
          const calendarApi = calendarRef.current.getApi();
          let joinMember = calendarData?.joinMember;
          if (joinMember) {
            if (memberName) {
              joinMember[memberId] = memberName;
              uploadCalendar({
                id,
                calendarApi,
                joinMember,
              });
              router.replace(`/calendar/${id}`);
            } else {
              alert("名前を入力してください");
            }
          } else {
            alert("エラーが起きましたもう一度お試しください");
          }
        }}
      >
        OK
      </button>
      <p>{memberId}</p>
      <p>{id}</p>
      <FullCalendar
        ref={calendarRef}
        plugins={[timegridPlugin, listPlugin]}
        events={calendarData?.events}
        headerToolbar={{
          right: "timeGridWeek,listYear",
        }}
        eventMinHeight={60}
        selectable={true}
        eventClick={handleEventSelect}
        eventContent={(contentInfo) => {
          console.log("content is", contentInfo.event.extendedProps.joinMember);
          return (
            <div>
              <div>
                {(contentInfo.event.extendedProps.joinMember as string[]).find(
                  (member) => member === memberId
                )
                  ? "✔"
                  : "✘"}
              </div>
              {contentInfo.event.extendedProps.joinMember.map(
                (name: string, index: number) => (
                  <p key={index}>{name}</p>
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
