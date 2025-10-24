import { sql } from "bun";
import type { DataItem, DataItemDto } from "./types";

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

const server = Bun.serve({
  routes: {
    "/api/posts": {
      GET: async (req) => {
        const url = new URL(req.url);
        const type = url.searchParams.get("type");

        let c = sql``;
        if (type === "0") {
          c = sql`WHERE datetime(created_at, 'localtime') > date('now', 'localtime') AND status IN (0,1)`;
        }

        const list: DataItem[] = await sql`SELECT * FROM posts ${c}`;
        return Response.json(list);
      },
      POST: async (req) => {
        const post = <DataItemDto>await req.json();

        const obj: DataItemDto = {
          doctor: post.doctor,
          patient: post.patient,
          method: post.method,
          status: post.status,
        };

        await sql`INSERT INTO posts ${sql(obj)}`;
        return new Response(null, { status: 204 });
      },
    },
    "/api/posts/:id": {
      GET: async (req) => {
        const id = req.params.id;
        const [post] = await sql`SELECT * FROM posts WHERE id = ${id}`;

        if (!post) {
          return new Response("Not Found", { status: 404 });
        }

        return Response.json(post);
      },
      PUT: async (req) => {
        const id = req.params.id;
        const [post1] = await sql`SELECT count(1) FROM posts WHERE id = ${id}`;

        if (!post1) {
          return new Response("Not Found", { status: 500 });
        }

        const post = <DataItemDto>await req.json();

        const obj: DataItemDto = {
          doctor: post.doctor,
          patient: post.patient,
          method: post.method,
          status: post.status,
        };

        await sql`UPDATE posts SET ${sql(obj)} WHERE id = ${id}`;

        return new Response(null, { status: 204 });
      },
      DELETE: async (req) => {
        const id = req.params.id;

        await sql`DELETE FROM posts WHERE id = ${id}`;

        return new Response(null, { status: 200 });
      },
    },
  },
});

console.log(`Server running at ${server.url}`);
