import { HttpContext, api } from "@nitric/sdk";
import { surveyJsonSchema } from "../forms";
import { surveyStore } from "../resources";
import { addCors, optionsHandler } from "../resources/middleware";

const formApi = api("forms", {
  middleware: [addCors],
});

formApi.get("/forms", async (ctx) => {
  ctx.res.json(surveyJsonSchema());
});

formApi.get("/reset", async (ctx) => {
  try {
    await surveyStore.reset();
  } catch (err) {
    console.error(err);
    ctx.res.status = 500;
    ctx.res.body = "An unexpected error has occurred";
  }
});

formApi.get("/submissions", async (ctx) => {
  try {
    ctx.res.json({
      output: await surveyStore.getSubmissions(),
    });
  } catch (err) {
    console.error(err);
    ctx.res.status = 500;
    ctx.res.body = "An unexpected error has occurred";
  }
});

formApi.get("/submissions/:email", async (ctx) => {
  const { email } = ctx.req.params;
  try {
    ctx.res.json({
      output: await surveyStore.getSubmissionsByEmail(email),
    });
  } catch (err) {
    console.error(err);
    ctx.res.status = 500;
    ctx.res.body = "An unexpected error has occurred";
  }
});

const saveHandler = async (ctx: HttpContext) => {
  const { submissionId } = ctx.req.params;
  try {
    const result = await surveyStore.save(ctx.req.json(), submissionId);
    if (!result.success) {
      ctx.res.status = 400;
      ctx.res.json(result.error);
      return ctx;
    } else {
      ctx.res.json({
        type: "saved",
        submissionId: result.submissionId,
      });
      ctx.res.status = 200;
    }
  } catch (err) {
    console.error(err);
    ctx.res.status = 500;
    ctx.res.body = "An unexpected error has occurred";
  }
};

// Save a form.
formApi.post("/forms/save", saveHandler);
formApi.post("/forms/save/:submissionId", saveHandler);

// Resume a form.
formApi.get("/forms/:submissionId", async (ctx) => {
  const { submissionId } = ctx.req.params;
  try {
    const submission = await surveyStore.get(submissionId);
    if (!submission) {
      ctx.res.status = 404;
      ctx.res.body = "not found";
      return;
    }
    if (submission.status === "submitted") {
      ctx.res.status = 401;
      ctx.res.body = "form already submitted";
      return ctx;
    }
    ctx.res.json(submission.data);
  } catch (err) {
    console.error(err);
    ctx.res.status = 500;
    ctx.res.body = "An unexpected error occurred";
  }
});

const submissionHandler = async (ctx: HttpContext) => {
  const { submissionId } = ctx.req.params;
  try {
    const result = await surveyStore.submit(ctx.req.json(), submissionId);
    console.log(`Handling submission for ${submissionId}`);
    if (!result.success) {
      console.log(result.success);
      ctx.res.status = result.error === "not found" ? 404 : 400;
      ctx.res.json(result.error + "teddies");
      return ctx;
    } else {
      ctx.res.json({
        type: "submitted",
        submissionId: result.submissionId,
      });
      ctx.res.status = 200;
    }
  } catch (err) {
    console.error(err);
    ctx.res.status = 500;
    ctx.res.body = "An unexpected error has occurred";
  }
};

// Submit a form.
formApi.post("/forms/submit/:submissionId", submissionHandler);
formApi.post("/forms/submit", submissionHandler);

formApi.options("/forms/save:submissionId", optionsHandler);
formApi.options("/forms/save", optionsHandler);
formApi.options("/forms/submit/:submissionId", optionsHandler);
formApi.options("/forms/submit", optionsHandler);
formApi.options("/forms", optionsHandler);
formApi.options("/submissions/:email", optionsHandler);
