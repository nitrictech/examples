import { sendEmail, createEmailRequest } from "../common/email";
import { inventorySub } from "../common/resources"; 
import * as Mustache from "mustache";

inventorySub.subscribe(async (ctx) => {
  // Send the email notification
  sendEmail(
    createEmailRequest({
      sender: process.env.SENDER_EMAIL,
      recipient: [ctx.req.json().recipient],
      body: "",
      html: Mustache.render(ctx.req.json().template, ctx.req.json().data),
      subject: Mustache.render(ctx.req.json().subject, ctx.req.json().data),
    })
  );

  return ctx;
});
