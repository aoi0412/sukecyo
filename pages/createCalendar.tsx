/* eslint-disable react-hooks/rules-of-hooks */
import FullCalendar from "@fullcalendar/react";
import timegridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { DateSelectArg, EventHoveringArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import { uploadCalendar } from "../functions/calendar";
import { saveCalendarList } from "../functions/localStorage";
import { useRouter } from "next/router";
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
    if (selectedLength < eventTimeLength) {
      //選択範囲<イベント時間の場合（イベント時間を一つ作成）
      const end = selectionInfo.start.getMinutes() + eventTimeLength;
      if (end < 60) {
        selectionInfo.end.setMinutes(end);
      } else {
        selectionInfo.end.setMinutes(end % 60);
        selectionInfo.end.setHours(Math.floor(end / 60));
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
            selectionInfo.start.getMinutes() + tmpMinuteCount + eventTimeLength;
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
              selectionInfo.start.setHours(startHour + Math.floor(start / 60));
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
  };
  const eventMouseClick = (selectionInfo: EventHoveringArg) => {
    const calendarApi = selectionInfo.view.calendar;
    console.log("id is", selectionInfo.event.id);
    calendarApi.getEventById(selectionInfo.event.id)?.remove();
  };
  const calendarRef = useRef<FullCalendar>(null!);
  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    if (window.innerWidth < 550) {
      calendarApi.changeView("timeGridDay");
    } else {
      calendarApi.changeView("timeGridWeek");
    }
  }, []);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <input
        type="number"
        value={eventTimeLength}
        onChange={(e) => setEventTimeLength(e.currentTarget.valueAsNumber)}
      />
      <input
        value={calendarName}
        onChange={(e) => setCalendarName(e.currentTarget.value)}
      />
      <button
        onClick={() => {
          const calendarApi = calendarRef.current.getApi();
          console.log("events is", calendarApi.getEvents());
          uploadCalendar({ calendarApi, calendarName, id });
          saveCalendarList({ id: id, name: calendarName });
          router.replace(`calendar/${id}`);
        }}
      >
        OK
      </button>
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
        }}
      >
        <FullCalendar
          locale="ja"
          dayHeaderFormat={{
            weekday: "short",
            month: "numeric",
            day: "numeric",
            omitCommas: true,
          }}
          height={"100%"}
          expandRows={true}
          ref={calendarRef}
          plugins={[timegridPlugin, listPlugin, interactionPlugin]}
          selectable={true}
          select={handleDateSelect}
          editable={true}
          scrollTime={"09:00:00"}
          eventClick={eventMouseClick}
          slotDuration="00:30:00"
          selectLongPressDelay={200}
          eventLongPressDelay={1000}
          selectAllow={(dateSpanApi) => {
            if (dateSpanApi.start.getTime() < new Date().getTime()) {
              alert("本日より前の日付を設定することはできません");
              return false;
            } else {
              if (dateSpanApi.start.getDay() !== dateSpanApi.end.getDay()) {
                alert("日をまたいだイベントを設定することはできません");
                return false;
              }
              return true;
            }
          }}
          eventAllow={(dateSpanApi) => {
            if (dateSpanApi.start.getTime() < new Date().getTime()) {
              return false;
            } else {
              return true;
            }
          }}
        />
      </div>
    </div>
  );
};

export default createCalendar;
