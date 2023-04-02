/* eslint-disable react-hooks/rules-of-hooks */
import FullCalendar from "@fullcalendar/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import timegridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { EventClickArg } from "@fullcalendar/core";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentCalendarAtom, currentEventsAtom } from "../../recoil";
import { updateCalendarJoinMember } from "../../functions/updateCalendar";
import { showError } from "../../functions/error";
import { saveCalendarList } from "../../functions/localStorage";
import { colors } from "../../styles/colors";
import StepTitle from "../../components/StepTitle";
import { css } from "@emotion/react";

const calendarPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [memberId, setMemberId] = useState<string>(
    new Date().getTime().toString()
  );
  const [calendarData, setCalendarData] = useRecoilState(currentCalendarAtom);
  const [eventData, setEventData] = useRecoilState(currentEventsAtom);
  const [memberName, setMemberName] = useState<string>("");
  const handleEventSelect = (selectionInfo: EventClickArg) => {
    console.log("selectionInfo: ", selectionInfo); // 選択した範囲の情報をconsoleに出力
    const eventData = selectionInfo.view.calendar.getEventById(
      selectionInfo.event.id
    );
    if (eventData && eventData.extendedProps.joinMember) {
      let tmpJoinMember: string[] = [...eventData.extendedProps.joinMember];
      if (tmpJoinMember.find((member) => member === memberId)) {
        tmpJoinMember = tmpJoinMember.filter((member) => member !== memberId);
      } else {
        tmpJoinMember.push(memberId);
      }
      eventData.setExtendedProp("joinMember", tmpJoinMember);
    }
  };
  const calendarRef = useRef<FullCalendar>(null!);
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.addEventSource({
        googleCalendarId:
          "e1f4968945138f2406fb11b7c048d4bdc89c600bc08feca06c0cb0d7bbfedbfc@group.calendar.google.com",
        googleCalendarApiKey: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY,
        display: "auto",
        color: "rgba(0,0,0,0.5)",
      });
    }
  }, [calendarRef.current]);
  if (typeof id !== "string") return <></>;
  if (calendarData === null) {
    router.back();
    return <>カレンダーのデータが存在しません</>;
  }
  if (eventData.length === 0) return <>イベントデータが存在しません</>;

  return (
    <div>
      <div>
        <StepTitle title="自分の名前を入力" step={1} />
        <input
          value={memberName}
          onChange={(e) => setMemberName(e.currentTarget.value)}
        />
      </div>

      <div>
        <StepTitle title="候補から参加できる日時を選択" step={2} />
        <button
          onClick={async () => {
            const response = await axios.get(
              "http://localhost:3000/api/generate-google-oauth-url"
            );
            const { authorizeUrl } = response.data;

            // Google認証ページを別タブで開く
            window.open(authorizeUrl, "_blank");
          }}
        >
          認証する
        </button>
        <FullCalendar
          ref={calendarRef}
          plugins={[timegridPlugin, listPlugin, googleCalendarPlugin]}
          events={eventData}
          headerToolbar={{
            right: "timeGridWeek,listYear,today,prev,next",
          }}
          eventColor={colors.accent}
          googleCalendarApiKey={process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}
          eventMinHeight={60}
          selectable={true}
          eventClick={handleEventSelect}
          eventContent={(contentInfo) => {
            console.log(contentInfo);
          }}
        />
      </div>
      <button
        css={css`
          width: 100%;
          background-color: ${colors.accent};
          border-radius: 20px;
          margin: 8px 32px;
          max-width: 300px;
          padding: 12px 8px;
          border: none;
          align-self: center;
          color: ${colors.white};
          font-weight: bold;
        `}
        onClick={() => {
          let joinMember = { ...calendarData?.joinMember };
          if (joinMember) {
            if (memberName) {
              joinMember[memberId] = memberName;
              updateCalendarJoinMember({
                id,
                eventData,
                memberId,
                memberName,
              })
                .then(() => {
                  saveCalendarList({
                    id,
                    name: calendarData.name,
                  });
                  router.replace(`/calendar/${id}`);
                })
                .catch((error) => {
                  showError({
                    title: error.title,
                    message: error.message,
                  });
                });
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
    </div>
  );
};

export default calendarPage;
