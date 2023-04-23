import BaseCalendar from "../ui/Calendar/BaseCalendar";
import timegridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { getZeroTimeday } from "../../functions/utils";
import { CalendarOptions } from "@fullcalendar/core";
import { forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

// eslint-disable-next-line react/display-name
const JoinCalendar = forwardRef<FullCalendar, CalendarOptions>((props, ref) => {
  return (
    <BaseCalendar
      ref={ref}
      {...props}
      scrollTime={null}
      showNonCurrentDates={true}
      plugins={[timegridPlugin, listPlugin, googleCalendarPlugin]}
      headerToolbar={{
        left: undefined,
        right: "timeGridWeek,listYear,today,prev,next",
      }}
      initialView={window.innerWidth < 500 ? "listYear" : "timeGridWeek"}
      googleCalendarApiKey={process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}
    />
  );
});

export default JoinCalendar;
