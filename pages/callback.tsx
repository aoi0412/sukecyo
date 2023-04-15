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
    const code = router.query.code;
    console.log("run", code);
    if (!code) return;
    axios
      .post("http://localhost:3000/api/get-google-auth-token", {
        authorizationCode: code,
      })
      .then((response) => {
        const { tokens } = response.data;

        // カレンダーの一覧を取得しstateに保存する
        axios
          .post("http://localhost:3000/api/get-google-calendar", {
            accessToken: tokens.access_token,
          })
          .then((res) => {
            localStorage.setItem("googleCalendarData", "null");
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
              localStorage.setItem(
                "googleCalendarData",
                JSON.stringify(tmpCalendarList)
              );
              window.close();
            } else {
              console.log("Error:something failed");
              window.close();
            }
          })
          .catch((error) => {
            console.log("Error", error);
          });
      });
  }, []);

  return <div>Loading...</div>;
}
