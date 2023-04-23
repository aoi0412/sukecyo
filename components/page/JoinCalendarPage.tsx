/* eslint-disable react-hooks/rules-of-hooks */
import FullCalendar from "@fullcalendar/react";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import { EventClickArg } from "@fullcalendar/core";
import { currentCalendarAtom, currentEventsAtom } from "../utils/recoil";
import { updateCalendarJoinMember } from "../../functions/updateCalendar";
import { showError } from "../../functions/error";
import { saveCalendarList } from "../../functions/localStorage";
import { colors } from "../../styles/colors";
import StepTitle from "../../components/ui/Title/StepTitle";
import { css } from "@emotion/react";
import CheckIcon from "../../public/check.svg";
import { eventForJoin } from "../../types/calendar";
import JoinCalendar from "../../features/joinEvent/components/JoinCalendar";
import { useRecoilState } from "recoil";
import ConnectGoogleButton from "@/features/connectGoogleCalendar/components/ConnectGoogleButton";

type Props = {
  router: NextRouter;
};

const JoinCalendarPage: FC<Props> = ({ router }) => {
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
      <ConnectGoogleButton />
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
      <JoinCalendar
        events={eventData}
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

export default JoinCalendarPage;
