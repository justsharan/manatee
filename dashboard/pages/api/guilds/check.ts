import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "./[guild]";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const guilds = (req.query.guilds as string).split(",");
  const finalArr = [];
  await sql.connect();
  for await (const guild of guilds) {
    const res = await sql.query("SELECT * FROM guilds WHERE id = $1;", [guild]);
    if (res.rows.length) finalArr.push(guild);
  }
  await sql.clean();
  return res.status(200).json(finalArr);
}
