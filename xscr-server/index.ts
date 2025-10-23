import { sql } from "bun";
import type { DataItem, DataItemDto } from "./types";

await sql`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    doctor TEXT NOT NULL,
    patient TEXT NOT NULL,
    method TEXT NOT NULL,
    status INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`;

const server = Bun.serve({
  routes: {
    "/api/ss": {
      GET: async (req) => {
        const url=new URL(req.url)
        const type = url.searchParams.get('type')
        
        const list: DataItem[] =
          await sql`SELECT * FROM posts WHERE status IN (0,1)`;
        return Response.json(list);
      },
      POST: async (req) => {
        const post = <DataItemDto>await req.json();
        await sql`INSERT INTO posts ${sql(
          post,
          "doctor",
          "patient",
          "method",
          "status"
        )}`;
        return Response.json();
      },
    },
  },
});

console.log(`Server running at ${server.url}`);
