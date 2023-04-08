import { calendarMember } from "../types/calendar";

export const calcRateOfMember = ({
  joinMember,
  allMember,
}: {
  joinMember: string[];
  allMember: calendarMember;
}): number => {
  const joinNum: number = joinMember.length;
  const allNum: number = Object.keys(allMember).length;
  if (allNum !== 0) {
    const rate = joinNum / allNum;
    return Math.round(rate * 100);
  } else {
    return 0;
  }
};

//時刻を切り捨てた（0:00）の日付を取得する
export const getZeroTimeday = (date: Date) => {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return day;
};

export const createGoogleCalendarURL = (props: {
  title: string;
  details: string;
  start: string;
  end: string;
}) => {
  console.log("props.start is", props.start);
  const tmpStart = props.start
    .replaceAll("-", "")
    .replaceAll("+", "")
    .replaceAll(":", "");
  const tmpEnd = props.end
    .replaceAll("-", "")
    .replaceAll("+", "")
    .replaceAll(":", "");

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${props.title}&dates=${tmpStart}/${tmpEnd}&details=${props.details}`;
};
