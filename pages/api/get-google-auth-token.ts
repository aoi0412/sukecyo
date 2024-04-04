import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { host } = req.headers;
  // プロトコルを追加する必要がある場合は、以下のように行います（httpまたはhttpsを適切に選択）
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = `${protocol}://${host}`;
  const { authorizationCode } = req.body;

  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: baseUrl + "/callback",
  });

  const response = await oauth2Client.getToken(authorizationCode);
  res.status(200).json({ tokens: response.tokens });
}
