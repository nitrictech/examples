import { api } from "@nitric/sdk";
import { conn } from "../resources/db.js";

const tasks = api('tasks');

// Get all tasks
tasks.get('/tasks',  async (ctx) => {
  try {
    const tasks = await conn.query('SELECT * FROM tasks');
    ctx.res.json(tasks.rows);
  } catch (err) {
    ctx.res.status = 500;
    ctx.res.json({ response: 'An error occurred fetching your tasks'});
  } 
});

// Create one task
tasks.post('/tasks',  async (ctx) => {
  try {
    const { description } = ctx.req.json();
    await conn.query('INSERT INTO tasks (description, completed) VALUES ($1, $2)', [
      description,
      false,
    ]);
    ctx.res.status = 200
    ctx.res.json({ response: 'Task created successfully'});
  } catch (err) {
    ctx.res.status = 500;
    ctx.res.json({ response: `An error occurred creating your task ${err}`});
  } 
});

// Update task completion
tasks.put('/tasks/:id',  async (ctx) => {
  try {
    const { id } = ctx.req.params;
    const { completed } = ctx.req.json();
    await conn.query('UPDATE tasks SET completed=$1 WHERE id=$2', [
      completed,
      id,
    ]);
    ctx.res.status = 200
  } catch (err) {
    ctx.res.status = 500;
    ctx.res.json({ response: 'An error occurred updating your task'});
  } 
});

// Delete item
tasks.delete('/tasks/:id', async (ctx) => {
  try {
    //const client = await conn.connect();
    const { id } = ctx.req.params;
    await conn.query('DELETE FROM tasks WHERE id=$1', [id]);
    ctx.res.status = 200
  } catch (err) {
    ctx.res.status = 500;
    ctx.res.json({ response: 'An error occurred deleting your task'});
  }
});


