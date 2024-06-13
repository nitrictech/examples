import { api } from "@nitric/sdk";
import getClient from "../db";
import { todo } from "../schema";
import { asc, eq, not } from "drizzle-orm";

const mainApi = api("main");

// fetch all todos, sorted by their identifier
mainApi.get("/todos", async (ctx) => {
  const db = await getClient();
  const data = await db.select().from(todo).orderBy(asc(todo.id));

  return ctx.res.json(data);
});

// inserts a new record into the todo table
mainApi.post("/todos/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const { text } = ctx.req.json();
  const db = await getClient();

  await db.insert(todo).values({
    id: parseInt(id),
    text,
  });
});

// updates the text of a todo by its identifier
mainApi.patch("/todos/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const { text } = ctx.req.json();
  const db = await getClient();

  await db
    .update(todo)
    .set({
      text: text,
    })
    .where(eq(todo.id, parseInt(id)));
});

// toggles the status of a todo to its opposite state
mainApi.patch("/todos/:id/toggle", async (ctx) => {
  const { id } = ctx.req.params;
  const db = await getClient();

  await db
    .update(todo)
    .set({
      done: not(todo.done),
    })
    .where(eq(todo.id, parseInt(id)));
});

// removes a todo by its identifier
mainApi.delete("/todos/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const db = await getClient();

  await db.delete(todo).where(eq(todo.id, parseInt(id)));
});
