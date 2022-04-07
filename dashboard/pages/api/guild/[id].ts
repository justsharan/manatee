import { NextApiRequest, NextApiResponse } from "next";
import postgres from "postgres";

type Nullable<T> = T | null;

interface GuildData {
  id: string;
  autorole: Nullable<string>;
  mod_log: Nullable<string>;
  member_log: Nullable<string>;
  message_log: Nullable<string>;
}

export const sql = postgres(process.env.DATABASE_URL);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      // Get guild from database
      const [guild]: GuildData[] =
        await sql`SELECT * FROM guilds WHERE id = ${req.query.id}`;
      if (!guild) {
        console.log({ guild });
        return res.status(404).send("No guild by that id");
      }

      // Send guild info
      return res.status(200).json(guild);

    case "POST":
      const data: Exclude<GuildData, "id"> = JSON.parse(req.body);
      try {
        const [row] = await sql`
          UPDATE guilds
          SET autorole = ${data.autorole}, mod_log = ${data.mod_log}, member_log = ${data.member_log}, message_log = ${data.message_log}
          WHERE id = ${req.query.id}
          RETURNING *;
        `;
        return res.status(200).json(
          // Convert "NULL" string to JS null
          Object.entries(row).reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v === "NULL" ? null : v }),
            {}
          )
        );
      } catch (err) {
        console.error(err);
        return res.status(500).send("Error querying database");
      }
  }
};
