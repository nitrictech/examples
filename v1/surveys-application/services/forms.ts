import { api } from "@nitric/sdk";
import { submissions, submitted } from "../resources/resources";
import { formSchemas } from "../form/schema";

const formApi = api("forms");

formApi.post("/forms/:formId", async (ctx) => {
  const formId = ctx.req.params.formId;
  const schema = formSchemas[formId];

  if (!schema) {
    ctx.res.status = 400;
    ctx.res.json({ msg: `Unknown formId: ${formId}` });
    return;
  }

  const parsed = schema.safeParse(ctx.req.json());

  if (!parsed.success) {
    ctx.res.status = 400;
    ctx.res.json({ msg: "Invalid submission", errors: parsed.error.format() });
    return;
  }

  const data = parsed.data;
  const id = `${formId}-${Date.now()}`;

  await submissions.set(id, data);
  await submitted.publish({ id, formId });

  ctx.res.json({ msg: "Submission received", id });
});
