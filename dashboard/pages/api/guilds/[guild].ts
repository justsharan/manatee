import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Get session
  const session = await getSession({ req });
  if (!session) return res.status(401).send("Not Authorized");

  // Get guildd from database
  const [guild] = await sql`SELECT * FROM guilds WHERE id = ${req.query.guild}`;
  if (!guild) return res.status(404).send("Not Found");

  // Send response
  return res.status(200).send(guild);
};
