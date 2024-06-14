import { api } from "@nitric/sdk";
import getClient from "../db";

const mainApi = api("main");

// fetch all todos, sorted by their identifier
mainApi.get("/todos", async (ctx) => {
  const db = await getClient();
  const data = await db.todo.findMany({
    orderBy: { id: "asc" },
  });

  return ctx.res.json(data);
});

// inserts a new record into the todo table
mainApi.post("/todos/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const { text } = ctx.req.json();
  const db = await getClient();

  await db.todo.create({
    data: {
      id: parseInt(id),
      text,
    },
  });
});

// updates the text of a todo by its identifier
mainApi.patch("/todos/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const { text } = ctx.req.json();
  const db = await getClient();

  await db.todo.update({
    where: { id: parseInt(id) },
    data: { text },
  });
});

// toggles the status of a todo to its opposite state
mainApi.patch("/todos/:id/toggle", async (ctx) => {
  const { id } = ctx.req.params;
  const db = await getClient();
  const todo = await db.todo.findUnique({
    where: { id: parseInt(id) },
  });

  if (todo) {
    await db.todo.update({
      where: { id: parseInt(id) },
      data: { done: !todo.done },
    });
  }
});

// removes a todo by its identifier
mainApi.delete("/todos/:id", async (ctx) => {
  const { id } = ctx.req.params;
  const db = await getClient();

  await db.todo.delete({
    where: { id: parseInt(id) },
  });
});
