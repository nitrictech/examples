import { receipts, submissions, output } from "../resources/resources";
import { buildReceipt } from "../form/receipt";

receipts.subscribe(async (ctx) => {
  const { id, formId } = ctx.req.json();
  const submission = await submissions.get(id);

  if (!submission) {
    console.error(`No submission found for ID: ${id}`);
    return;
  }

  // Build the PDF buffer from the submission data
  const buffer = await buildReceipt(submission, formId);

  // Store the PDF file in the bucket
  const file = output.file(`${id}.pdf`);
  await file.write(buffer);

  console.log(`Receipt stored for ${id}`);
});
