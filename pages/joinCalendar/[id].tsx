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
import CheckIcon from "../../public/check.svg";
import { google } from "googleapis";
import GoogleIcon from "../../public/google.svg";
import { event, eventForJoin } from "../../types/calendar";

const calendarPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [memberId, setMemberId] = useState<string>(
    new Date().getTime().toString()
  );

  const [calendarData, setCalendarData] = useRecoilState(currentCalendarAtom);
  const [eventData, setEventData] = useRecoilState(currentEventsAtom);
  const [selectedEvents, setSelectedEvents] = useState<eventForJoin[]>([]);
  const [memberName, setMemberName] = useState<string>("");
  const [googleCalendarList, setGoogleCalendarList] = useState<
    {
      color: string;
      name: string;
    }[]
  >([]);
  const [baseURL, setBaseURL] = useState<string>("");
  const handleEventSelect = (selectionInfo: EventClickArg) => {
    console.log("selectionInfo: ", selectionInfo); // 選択した範囲の情報をconsoleに出力
    let tmpEventData = [...selectedEvents];
    const event = selectionInfo.event;
    if (tmpEventData.some((_) => _.event.id === event.id)) {
      const index = tmpEventData.findIndex((_) => _.event.id === event.id);
      if (tmpEventData[index].isSelected) {
        tmpEventData[index].isSelected = false;
      } else {
        tmpEventData[index].isSelected = true;
      }
    } else {
      let tmpJoinMember = [...event.extendedProps.joinMember];
      tmpJoinMember.push(memberId);
      tmpEventData.push({
        isSelected: true,
        event: {
          id: event.id,
          end: event.endStr,
          start: event.startStr,
          joinMember: tmpJoinMember,
        },
      });
    }
    setSelectedEvents(tmpEventData);
  };
  const calendarRef = useRef<FullCalendar>(null!);

  useEffect(() => {
    const tmpBaseURL = window.location.origin;
    if (!tmpBaseURL) alert("URLが取得できませんでした");
    setBaseURL(tmpBaseURL);
    if (
      typeof router.query.memberId === "string" &&
      typeof router.query.memberName === "string"
    ) {
      setMemberId(router.query.memberId);
      setMemberName(router.query.memberName);
      const calenadrApi = calendarRef.current.getApi();
      let tmpSelectedList: eventForJoin[] = [];
      calenadrApi.getEvents().forEach((event) => {
        const joinMember: string[] = event.extendedProps.joinMember;

        if (joinMember.some((_) => _ === router.query.memberId)) {
          console.log(
            "event data is",
            event,
            ",is member",
            joinMember,
            "id is",
            router.query.memberId
          );
          tmpSelectedList.push({
            isSelected: true,
            event: {
              id: event.id,
              end: event.endStr,
              start: event.startStr,
              joinMember: event.extendedProps.joinMember,
            },
          });
        }
      });
      console.log("selected is", tmpSelectedList);
      setSelectedEvents(tmpSelectedList);
    }
    if (calendarRef.current) {
      window.onstorage = (event) => {
        if (event.key != "googleCalendarData") return;
        const calendarApi = calendarRef.current.getApi();
        if (event.newValue) {
          const googleCalendarList = JSON.parse(event.newValue);
          if (Array.isArray(googleCalendarList)) {
            let tmpGoogleCalendarList: { name: string; color: string }[] = [];
            googleCalendarList.forEach((calendar) => {
              calendarApi.addEventSource(calendar);
              tmpGoogleCalendarList.push({
                color: calendar.color,
                name: calendar.title,
              });
            });
            setGoogleCalendarList(tmpGoogleCalendarList);
          }
        }
      };
    }
  }, []);
  if (typeof id !== "string") return <></>;
  if (calendarData === null) {
    router.back();
    return <>カレンダーのデータが存在しません</>;
  }
  if (eventData.length === 0) return <>イベントデータが存在しません</>;

  return (
    <div
      css={css`
        display: flex;
        flex: 1;
        height: 100%;
        flex-direction: column;
        padding: 20px;
        max-width: 1000px;
      `}
    >
      <button
        css={css`
          position: absolute;
          top: 80px;
          right: 12px;
          width: 40px;
          height: 40px;
          background-color: ${colors.main};
          margin: 0;
          padding: 0;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `}
        onClick={async () => {
          const response = await axios.get(
            `${baseURL}/api/generate-google-oauth-url`
          );
          const { authorizeUrl } = response.data;
          console.log("response", response);

          // Google認証ページを別タブで開く
          window.open(authorizeUrl, "_blank");
        }}
      >
        <GoogleIcon
          fill={colors.white}
          css={css`
            width: 20px;
            height: 20px;
          `}
        />
      </button>
      <div>
        <StepTitle title="自分の名前を入力" step={1} />
        <input
          value={memberName}
          css={css`
            font-size: 16px;
          `}
          onChange={(e) => setMemberName(e.currentTarget.value)}
        />
      </div>

      <StepTitle title="候補から参加できる日時を選択" step={2} />
      <FullCalendar
        allDaySlot={false}
        scrollTime={null}
        visibleRange={{
          start: new Date(),
        }}
        showNonCurrentDates={true}
        ref={calendarRef}
        plugins={[timegridPlugin, listPlugin, googleCalendarPlugin]}
        events={eventData}
        headerToolbar={{
          left: undefined,
          right: "timeGridWeek,listYear,today,prev,next",
        }}
        height={"100%"}
        initialView={window.innerWidth < 500 ? "listYear" : "timeGridWeek"}
        eventColor={colors.accent}
        googleCalendarApiKey={process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}
        selectable={true}
        eventClick={handleEventSelect}
        eventContent={(contentInfo) => {
          if (contentInfo.event.title) {
            console.log(googleCalendarList, ":", contentInfo);
            return (
              <div>
                {
                  googleCalendarList.find(
                    (_) => _.color === contentInfo.backgroundColor
                  )?.name
                }
              </div>
            );
          } else if (
            selectedEvents.some((_) => _.event.id === contentInfo.event.id) &&
            selectedEvents.find((_) => _.event.id === contentInfo.event.id)
              ?.isSelected
          ) {
            return (
              <div
                css={css`
                  max-height: 24px;
                  max-width: 24px;
                  height: 100%;
                  aspect-ratio: 1;
                  border-radius: 100%;
                  background-color: ${colors.dark};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <CheckIcon
                  fill={colors.white}
                  css={css`
                    width: 100%;
                    max-width: 12px;
                    max-height: 12px;
                    height: 100%;
                  `}
                />
              </div>
            );
          } else return <></>;
        }}
      />
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
              console.log("eventData is", selectedEvents);
              joinMember[memberId] = memberName;
              updateCalendarJoinMember({
                id,
                eventData: selectedEvents,
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
                    location: "join [id].tsx;316",
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
