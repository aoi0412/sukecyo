import ja from "@fullcalendar/core/locales/ja";
import timegrid from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import { useCallback, useId } from "react";
import { DateSelectArg } from "@fullcalendar/core";

const ScrollableCalendar = () => {
  const onSelect = (selectInfo: DateSelectArg) => {
    console.log("aiueo");
    let title = prompt("イベントのタイトルを入力してください")?.trim();
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    if (title) {
      calendarApi.addEvent({
        id: new Date().getTime().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };
  return (
    <div>
      <FullCalendar locale={ja} selectable={true} select={onSelect} />
    </div>
  );
};

export default ScrollableCalendar;
