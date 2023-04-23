import FullCalendar from "@fullcalendar/react";
import { CalendarOptions } from "@fullcalendar/core";
import { colors } from "../../../styles/colors";
import { ClassAttributes, FC, MutableRefObject, forwardRef } from "react";

type Props = CalendarOptions;

// eslint-disable-next-line react/display-name
const BaseCalendar = forwardRef<FullCalendar, CalendarOptions>((props, ref) => {
  return (
    <FullCalendar
      {...props}
      ref={ref}
      allDaySlot={false}
      visibleRange={{
        start: new Date(),
      }}
      locale="ja"
      height={"100%"}
      eventColor={colors.accent}
      selectable={true}
    />
  );
});

export default BaseCalendar;
