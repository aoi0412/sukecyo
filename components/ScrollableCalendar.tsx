import ja from "@fullcalendar/core/locales/ja";
import timegrid from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import {
  DateSelectArg,
  EventInput,
  EventSourceInput,
} from "@fullcalendar/core";
import { FC } from "preact/compat";

type Props = { events: EventSource[] };

const ScrollableCalendar: FC<Props> = ({ events }) => {
  console.log("events is", events);
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
      <FullCalendar
        locale="ja"
        plugins={[timegrid]}
        selectable={true}
        select={onSelect}
        events={events}
      />
    </div>
  );
};

export default ScrollableCalendar;
