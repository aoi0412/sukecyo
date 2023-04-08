import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { fetchedCalendar } from "../types/googleCalendar";

export default function Callback() {
  const [calendars, setCalendars] = useState<fetchedCalendar[]>([]);
  const [selectedList, setSelectedList] = useState<fetchedCalendar[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fn = async () => {
      const code = router.query.code;
      if (!code) return;

      const response = await axios.post(
        "http://localhost:3000/api/get-google-auth-token",
        {
          authorizationCode: code,
        }
      );

      const { tokens } = response.data;

      // カレンダーの一覧を取得しstateに保存する
      axios
        .post("http://localhost:3000/api/get-google-calendar", {
          accessToken: tokens.access_token,
        })
        .then((res) => {
          let tmpCalendarList: fetchedCalendar[] = [];
          if (Array.isArray(res.data.items) && res.data.items.length !== 0) {
            console.log(res.data.items);
            res.data.items.forEach((calendarData: any) => {
              tmpCalendarList.push({
                color: calendarData.backgroundColor,
                display: "background",
                googleCalendarId: calendarData.id,
                googleCalendarApiKey: process.env
                  .NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY as string,
                title: calendarData.summary as string,
              });
            });
            console.log("datalist is", tmpCalendarList);
            setCalendars(tmpCalendarList);
          }
        });
    };
    fn().then();
  }, [router.query.code]);

  return (
    <div>
      {calendars.map((calendar, index) => (
        <div key={index}>
          <input
            type="checkbox"
            value={calendar.title}
            onClick={(e) => {
              let tmpCalendars = [...selectedList];
              if (tmpCalendars.find((_) => _.title === e.currentTarget.value)) {
                console.log("a");
                tmpCalendars = tmpCalendars.filter(
                  (_) => _.title !== e.currentTarget.value
                );
              } else {
                console.log("b");
                tmpCalendars.push(calendar);
              }
              console.log("pushed", tmpCalendars, ",", e.currentTarget.value);
              setSelectedList(tmpCalendars);
            }}
          />
          <p>{calendar.title}</p>
        </div>
      ))}
      <button
        onClick={() => {
          console.log("googlecalenar is", selectedList);
          localStorage.setItem(
            "googleCalendarData",
            JSON.stringify(selectedList)
          );
          window.close();
        }}
      >
        OK
      </button>
    </div>
  );
}
