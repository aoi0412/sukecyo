import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { authorizationCode } = req.body;

  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL,
  });

  const response = await oauth2Client.getToken(authorizationCode);
  res.status(200).json({ tokens: response.tokens });
}
