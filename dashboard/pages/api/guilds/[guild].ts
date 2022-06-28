import { NextApiRequest, NextApiResponse } from "next";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const [guild] = await sql`SELECT * FROM guilds WHERE id = ${req.query.guild}`;
  return guild
    ? res.status(200).json(guild)
    : res.status(404).send("Not Found");
}
