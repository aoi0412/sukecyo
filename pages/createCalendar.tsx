/* eslint-disable react-hooks/rules-of-hooks */
import FullCalendar from "@fullcalendar/react";
import timegridPlugin from "@fullcalendar/timegrid";
import { Calendar, DateSelectArg, EventHoveringArg } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import { LegacyRef, MutableRefObject, useRef, useState } from "react";
import { uploadCalendar } from "../functions/calendar";
const createCalendar = () => {
  const [calendarName, setCalendarName] = useState<string>("");
  const id: string = new Date().getTime().toString();
  const handleDateSelect = (selectionInfo: DateSelectArg) => {
    console.log("selectionInfo: ", selectionInfo); // 選択した範囲の情報をconsoleに出力
    const calendarApi = selectionInfo.view.calendar;

    calendarApi.addEvent({
      start: selectionInfo.start,
      end: selectionInfo.end,
      id: new Date().getTime().toString(),
    });
  };
  const eventMouseClick = (selectionInfo: EventHoveringArg) => {
    const calendarApi = selectionInfo.view.calendar;
    console.log("id is", selectionInfo.event.id);
    calendarApi.getEventById(selectionInfo.event.id)?.remove();
  };
  const calendarRef = useRef<FullCalendar>(null!);
  return (
    <div>
      <input
        value={calendarName}
        onChange={(e) => setCalendarName(e.currentTarget.value)}
      />
      <button
        onClick={() => {
          const calendarApi = calendarRef.current.getApi();
          console.log("events is", calendarApi.getEvents());
          uploadCalendar({ calendarApi, calendarName, id });
        }}
      >
        OK
      </button>
      <FullCalendar
        ref={calendarRef}
        plugins={[timegridPlugin, interactionPlugin]}
        selectable={true}
        dragScroll={true}
        select={handleDateSelect}
        editable={true}
        eventStartEditable={true}
        eventResizableFromStart={true}
        eventClick={eventMouseClick}
        dayCount={100}
        slotDuration="01:00:00"
        snapDuration="00:10:00"
      />
    </div>
  );
};

export default createCalendar;
