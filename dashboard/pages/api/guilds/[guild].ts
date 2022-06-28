import { NextApiRequest, NextApiResponse } from "next";
import PGClient from "serverless-postgres";

const sql = new PGClient({ connectionString: process.env.DATABASE_URL });

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await sql.connect();
  const result = await sql.query("SELECT * FROM guilds where id = $1;", [
    req.query.guild,
  ]);
  await sql.clean();
  return result.rows.length
    ? res.status(200).json(result.rows[0])
    : res.status(404).send("No guild found");
}
