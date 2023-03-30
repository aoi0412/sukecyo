import { calendarList } from "../types/localStorage";

export const saveCalendarList = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): calendarList => {
  const calendarListJson = localStorage.getItem("calendarList");
  if (calendarListJson) {
    let calendarList: calendarList = JSON.parse(calendarListJson);
    if (calendarList.length === 0) {
      calendarList = [];
    }
    calendarList.push({ id: id, name: name });
    localStorage.setItem("calendarList", JSON.stringify(calendarList));
    return calendarList;
  } else {
    localStorage.setItem(
      "calendarList",
      JSON.stringify([{ id: id, name: name }])
    );
    return [];
  }
};

export const deleteCalendarList = (id: string): calendarList => {
  const calendarListJson = localStorage.getItem("calendarList");
  if (calendarListJson) {
    let calendarList: calendarList = JSON.parse(calendarListJson);
    if (calendarList.length === 0) {
      calendarList = [];
    }
    calendarList = calendarList.filter((calendar) => calendar.id !== id);
    localStorage.setItem("calendarList", JSON.stringify(calendarList));
    return calendarList;
  } else {
    return [];
  }
};

export const getCalendarList = (): calendarList => {
  const calendarListJson = localStorage.getItem("calendarList");
  if (calendarListJson) {
    let calendarList: calendarList = JSON.parse(calendarListJson);
    if (calendarList.length === 0) {
      return [];
    }
    return calendarList;
  } else {
    return [];
  }
};
