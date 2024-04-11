import { createEmailRequest, sendEmail } from "../common/email";
import { custCreateSub } from "../common/resources";

custCreateSub.subscribe(async (ctx) => {
  const { template, subject, recipient } = ctx.req.json();
  // Send the email notification
  sendEmail(
    createEmailRequest({
      sender: process.env.SENDER_EMAIL as string,
      recipient: [recipient],
      body: "",
      html: template,
      subject: subject,
    })
  );
  return ctx;
});
