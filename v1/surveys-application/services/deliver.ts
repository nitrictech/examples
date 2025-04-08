import { receipts } from "../resources/resources";

receipts.subscribe(async (ctx) => {
  const { id } = ctx.req.json();

  // Simulate delivery or hook into a real email/SaaS integration
  console.log(`Delivering receipt for submission: ${id}`);
});
