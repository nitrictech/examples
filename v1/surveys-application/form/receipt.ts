import PDFDocument from "pdfkit";
import { feedbackSchema, rsvpSchema } from "./schema";
import { z } from "zod";

type FeedbackSubmission = z.infer<typeof feedbackSchema>;
type RsvpSubmission = z.infer<typeof rsvpSchema>;

export const buildReceipt = async (
  data: any,
  formId: string
): Promise<Buffer> => {
  const receipt = new PDFDocument({ bufferPages: true });

  const doneWriting = new Promise<Buffer>((resolve) => {
    const buffers: Uint8Array[] = [];

    receipt.on("data", buffers.push.bind(buffers));
    receipt.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    receipt.font("Times-Roman").fontSize(20).text("Survey - Receipt", 100, 100);
    receipt
      .font("Times-Roman")
      .fontSize(16)
      .text("Submission Details", 100, 150);

    if (formId === "feedback") {
      const { name, rating, feedback } = data as FeedbackSubmission;

      receipt
        .font("Times-Roman")
        .fontSize(12)
        .text(
          `Name: ${name}
Rating: ${rating}
Feedback: ${feedback || "N/A"}`,
          100,
          175
        );
    } else if (formId === "rsvp") {
      const { name, attending, guests } = data as RsvpSubmission;

      receipt
        .font("Times-Roman")
        .fontSize(12)
        .text(
          `Name: ${name}
Attending: ${attending ? "Yes" : "No"}
Guests: ${guests}`,
          100,
          175
        );
    } else {
      receipt
        .font("Times-Roman")
        .fontSize(12)
        .text("Unknown form type. No details available.", 100, 175);
    }

    receipt.end();
  });

  return await doneWriting;
};
