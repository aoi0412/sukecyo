import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Callback() {
  const [calendars, setCalendars] = useState<any[]>([]);
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
      // tokens = {
      //   access_token: "",
      //   expiry_date: 1673545804055,
      //   refresh_token: "",
      //   scope: "https://www.googleapis.com/auth/calendar.readonly",
      //   token_type: "Bearer",
      // }
      const { tokens } = response.data;

      // カレンダーの一覧を取得しstateに保存する
      const res = await axios.post(
        "http://localhost:3000/api/get-google-calendar",
        {
          accessToken: tokens.access_token,
        }
      );
      setCalendars(res.data);
      console.log(res.data);
    };
    fn().then();
  }, [router.query.code]);

  return <div></div>;
}
