import { calendar, calendarMember, event } from "../types/calendar";

export const isCalendar = (data: any): data is calendar => {
  return (
    data !== null &&
    typeof data === "object" &&
    typeof data.name === "string" &&
    typeof data.id === "string" &&
    typeof data.URL === "string" &&
    isJoinMember(data.joinMember)
  );
};

export const isJoinMember = (data: any): data is calendarMember => {
  return data !== null && typeof data === "object";
};

export const isEvent = (data: any): data is event => {
  return (
    data !== null &&
    typeof data === "object" &&
    typeof data.id === "string" &&
    isDate(data.end) &&
    isDate(data.start) &&
    Array.isArray(data.joinMember)
  );
};

export const isDate = (data: any): data is Date => {
  let tmp = toString.call(new Date()).slice(8, -1);
  if (tmp === "Date") {
    return true;
  } else {
    return false;
  }
};
