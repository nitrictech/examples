import { api } from "@nitric/sdk";
import getClient from "../resources/db";

const mainApi = api("main");

// fetch all todos
mainApi.get("/todos", async (ctx) => {
  const client = await getClient();
  const result = await client.query("SELECT * FROM todos ORDER BY id ASC");
  return ctx.res.json(result.rows);
});

// Insert a new todo
mainApi.post("/todos/", async (ctx) => {
  const { content } = ctx.req.json();
  const client = await getClient();
  await client.query("INSERT INTO todos (content, done) VALUES ($1, $2)", [
    content,
    false,
  ]);
});

// update text of a todo
mainApi.patch("/todos/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const { content } = ctx.req.json();
  const client = await getClient();
  await client.query("UPDATE todos SET content = $1 WHERE id = $2", [
    content,
    parseInt(id),
  ]);
});

// Toggle todo completion status
mainApi.patch("/todos/:id/toggle", async (ctx) => {
  const { id } = ctx.req.params;
  const client = await getClient();

  await client.query("UPDATE todos SET done = NOT done WHERE id = $1", [
    parseInt(id),
  ]);
});

// delete a todo
mainApi.delete("/todos/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const client = await getClient();
  await client.query("DELETE FROM todos WHERE id = $1", [parseInt(id)]);
});
