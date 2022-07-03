import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { DBGuild } from "types/database";
import { sql } from "../[guild]";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  const token = await getToken({ req });
  if (!token) {
    return res.status(401);
  }

  await sql.connect();
  const body: DBGuild = JSON.parse(req.body);

  const result = await sql.query(
    "UPDATE guilds SET autorole = $1, mod_log = $2, member_log = $3, message_log = $4 WHERE id = $5 RETURNING *;",
    [
      body.autorole || null,
      body.mod_log || null,
      body.member_log || null,
      body.message_log || null,
      req.query.guild,
    ]
  );

  return res.status(200).json(result.rows[0]);
}
