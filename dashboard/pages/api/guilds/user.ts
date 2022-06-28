import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (token) {
    const apiRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    return res.status(200).json(await apiRes.json());
  } else {
    res.status(401);
  }
}
