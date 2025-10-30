import { sql } from "bun";
import { z } from "zod";
import type { DataItem } from "./types";

await sql`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor TEXT NOT NULL,
    patient TEXT NOT NULL,
    method TEXT NOT NULL,
    status INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT current_timestamp
  )
`;

const IdSchema = z.coerce.number();

const PostSchema = z.object({
  doctor: z.string(),
  patient: z.string(),
  method: z.string(),
  status: z.number(),
});

const server = Bun.serve({
  routes: {
    "/api/posts": {
      GET: async (req) => {
        const url = new URL(req.url);
        const type = url.searchParams.get("type");

        let c = sql``;
        if (type === "0") {
          c = sql` AND status IN (0,1)`;
        }

        const list: DataItem[] =
          await sql`SELECT * FROM posts WHERE datetime(created_at, 'localtime') > date('now', 'localtime') ${c}`;
        return Response.json(list);
      },
      POST: async (req) => {
        const obj = await req.json();
        const dto = PostSchema.parse(obj);

        await sql`INSERT INTO posts ${sql(dto)}`;
        return new Response(null, { status: 204 });
      },
    },
    "/api/posts/:id": {
      GET: async (req) => {
        const id = IdSchema.parse(req.params.id);

        const [post] = await sql`SELECT * FROM posts WHERE id = ${id}`;
        if (!post) {
          return new Response("Not Found", { status: 404 });
        }

        return Response.json(post);
      },
      PUT: async (req) => {
        const id = IdSchema.parse(req.params.id);

        const obj = await req.json();
        const dto = PostSchema.parse(obj);

        const [a] = await sql`SELECT count(1) FROM posts WHERE id = ${id}`;
        if (!a) {
          return new Response("Not Found", { status: 500 });
        }

        await sql`UPDATE posts SET ${sql(dto)} WHERE id = ${id}`;

        return new Response(null, { status: 204 });
      },
      DELETE: async (req) => {
        const id = IdSchema.parse(req.params.id);

        await sql`DELETE FROM posts WHERE id = ${id}`;

        return new Response(null, { status: 200 });
      },
    },
  },
});

console.log(`Server running at ${server.url}`);
