import type { NextApiRequest, NextApiResponse } from "next";
import { google, calendar_v3 } from "googleapis";
import Calendar = calendar_v3.Calendar;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accessToken } = req.body;

  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL,
  });

  // 認証情報を設定
  // tokens として受け取った access_token・refresh_token・expiry_date などが設定可能
  // access_token が最低限必須
  oauth2Client.setCredentials({ access_token: accessToken });

  // Googleカレンダーの一覧を取得する
  const calendar: Calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });
  const calendarResponse = await calendar.calendarList.list();

  // カレンダーの一覧をレスポンスに含める
  res.status(200).json({ items: calendarResponse.data.items });
}
