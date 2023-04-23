/* eslint-disable react-hooks/rules-of-hooks */
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventHoveringArg } from "@fullcalendar/core";
import { useEffect, useRef, useState } from "react";
import { uploadCalendar } from "../functions/createCalendar";
import { saveCalendarList } from "../functions/localStorage";
import { useRouter } from "next/router";
import { getZeroTimeday } from "../functions/utils";
import { css } from "@emotion/react";
import { colors } from "../styles/colors";
import StepTitle from "../components/Title/StepTitle";
import CreateCalendar from "../components/Calendar/CreateCalendar";
import LargeButton from "../components/Button/LargeButton";
import Input from "../components/Input";
const createCalendar = () => {
  const [calendarName, setCalendarName] = useState<string>("");
  const [eventTimeLength, setEventTimeLength] = useState<number>(60);
  const router = useRouter();
  const id: string = new Date().getTime().toString();
  const handleDateSelect = (selectionInfo: DateSelectArg) => {
    const calendarApi = selectionInfo.view.calendar;
    const selectedLength = Math.floor(
      (selectionInfo.end.getTime() - selectionInfo.start.getTime()) /
        (1000 * 60)
    );
    let tmpMinuteCount = 0;
    const startHour = selectionInfo.start.getHours();
    const today = getZeroTimeday(new Date());
    if (selectionInfo.start < today || selectionInfo.end < today) {
      alert("本日より前の日付を設定することはできません");
      calendarApi.unselect();
    } else if (selectionInfo.start.getDay() !== selectionInfo.end.getDay()) {
      alert("日をまたいだイベントを設定することはできません");
      calendarApi.unselect();
    } else {
      if (selectedLength < eventTimeLength) {
        //選択範囲<イベント時間の場合（イベント時間を一つ作成）
        const end = selectionInfo.start.getMinutes() + eventTimeLength;
        if (end < 60) {
          selectionInfo.end.setMinutes(end);
        } else {
          selectionInfo.end.setMinutes(end % 60);
          selectionInfo.end.setHours(startHour + Math.floor(end / 60));
        }
        calendarApi.addEvent({
          start: selectionInfo.start,
          end: selectionInfo.end,
          id: new Date().getTime().toString(),
        });
      } else {
        //選択範囲≥イベント時間の場合（イベント時間を範囲内でできるだけ作成）
        while (true) {
          if (selectedLength - tmpMinuteCount >= eventTimeLength) {
            //イベントを追加 ↓条件
            //イベントの始まりからイベント時間の分数を追加するが合計分数が60を超えたら始まりの時間を追加する
            const end =
              selectionInfo.start.getMinutes() +
              tmpMinuteCount +
              eventTimeLength;
            const start = selectionInfo.start.getMinutes() + tmpMinuteCount;
            if (end < 60) {
              selectionInfo.end.setMinutes(end);
            } else {
              selectionInfo.end.setMinutes(end % 60);

              selectionInfo.end.setHours(startHour + Math.floor(end / 60));
              if (start < 60) {
                selectionInfo.start.setMinutes(start);
              } else {
                selectionInfo.start.setMinutes(start % 60);
                selectionInfo.start.setHours(
                  startHour + Math.floor(start / 60)
                );
                console.log(
                  selectionInfo.start.getHours(),
                  "start",
                  start % 60,
                  ":",
                  Math.floor(start / 60)
                );
              }
            }

            calendarApi.addEvent({
              start: selectionInfo.start,
              end: selectionInfo.end,
              id: new Date().getTime().toString(),
            });
            console.log(selectedLength - tmpMinuteCount, ">=", eventTimeLength);
            tmpMinuteCount += eventTimeLength;
          } else {
            break;
          }
        }
      }
    }
  };
  const eventMouseClick = (selectionInfo: EventHoveringArg) => {
    const calendarApi = selectionInfo.view.calendar;
    console.log("id is", selectionInfo.event.id);
    calendarApi.getEventById(selectionInfo.event.id)?.remove();
  };
  const calendarRef = useRef<FullCalendar>(null);
  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    console.log("today is ", today);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (window.innerWidth < 550) {
        calendarApi.changeView("timeGridDay");
      } else {
        calendarApi.changeView("timeGridWeek");
      }
    }
  }, [calendarRef]);
  return (
    <div
      css={css`
        display: flex;
        flex: 1;
        height: 100%;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          margin: 8px 20px;
        `}
      >
        <StepTitle title="会議内容を入力" step={1} />
        <div
          css={css`
            display: flex;
            gap: 8px;
            align-items: center;
            margin: 4px 24px;
          `}
        >
          <Input
            value={calendarName}
            onChange={(e) => setCalendarName(e.currentTarget.value)}
            placeholder="会議名"
          />
          <Input
            type="number"
            value={eventTimeLength}
            onChange={(e) => setEventTimeLength(e.currentTarget.valueAsNumber)}
          />
        </div>
      </div>
      <div
        css={css`
          margin: 8px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        `}
      >
        <StepTitle title="会議予定の候補を選択" step={2} />
        <CreateCalendar
          ref={calendarRef}
          select={handleDateSelect}
          eventClick={eventMouseClick}
        />
      </div>
      <LargeButton
        onClick={() => {
          console.log("aiueo", calendarRef.current);
          if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            if (calendarName === "") {
              alert("イベント名を入力してください");
            } else if (calendarApi.getEvents().length === 0) {
              alert("日程を1つ以上選択してください");
            } else {
              console.log("events is", calendarApi.getEvents());
              uploadCalendar({ calendarApi, calendarName, id });
              saveCalendarList({ id: id, name: calendarName });
              router.replace(`calendar/${id}`);
            }
          }
        }}
        css={css`
          position: fixed;
          bottom: 0px;
        `}
      >
        OK
      </LargeButton>
    </div>
  );
};

export default createCalendar;
