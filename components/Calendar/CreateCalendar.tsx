import BaseCalendar from "../ui/Calendar/BaseCalendar";
import timegridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { getZeroTimeday } from "../../functions/utils";
import { CalendarOptions } from "@fullcalendar/core";
import { forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";

// eslint-disable-next-line react/display-name
const CreateCalendar = forwardRef<FullCalendar, CalendarOptions>(
  (props, ref) => {
    return (
      <BaseCalendar
        ref={ref}
        {...props}
        editable={true}
        contentHeight={600}
        dayHeaderFormat={{
          weekday: "short",
          month: "numeric",
          day: "numeric",
          omitCommas: true,
        }}
        headerToolbar={{
          right: "prev,next",
          left: undefined,
        }}
        expandRows={true}
        plugins={[timegridPlugin, listPlugin, interactionPlugin]}
        scrollTime={"09:00:00"}
        slotDuration="00:30:00"
        selectLongPressDelay={200}
        eventLongPressDelay={500}
        eventAllow={(dateSpanApi: any) => {
          if (
            dateSpanApi.start.getTime() < getZeroTimeday(new Date()).getTime()
          ) {
            return false;
          } else {
            return true;
          }
        }}
      />
    );
  }
);

export default CreateCalendar;
