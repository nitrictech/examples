import { api } from "@nitric/sdk";
import { output } from "../resources/resources";

const receiptApi = api("receipts");

receiptApi.get("/receipts/:id", async (ctx) => {
  const id = ctx.req.params.id;
  const file = output.file(`${id}.pdf`);
  const url = await file.getDownloadUrl();
  ctx.res.body = url;
});
