import PDFDocument from "pdfkit";
import { FormData } from "./schema";

export const buildReceipt = async (data: FormData) => {
  const receipt = new PDFDocument({ bufferPages: true });
  const doneWriting = new Promise<Buffer>((resolve, reject) => {
    const buffers = [] as any;
    receipt.on("data", buffers.push.bind(buffers));
    receipt.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    const { primary } = data;

    receipt.font("Times-Roman").fontSize(20).text(`Survey - Receipt`, 100, 100);
    receipt
      .font("Times-Roman")
      .fontSize(16)
      .text(`Primary Applicant Details`, 100, 150);
    receipt
      .font("Times-Roman")
      .fontSize(12)
      .text(
        `Name:
  ${primary.firstName} ${primary.lastName}

Email:
  ${primary.email}

Address:
  ${primary.address.streetNumber} ${primary.address.street} ${
          primary.address.city
        } ${primary.address.state}

Questionnaire:
  Pizza: ${primary.questionnaire.isPizzaFan ? "Yes" : "No"}
  Icecream: ${primary.questionnaire.isIceCreamFan ? "Yes" : "No"}
`,
        100,
        175
      );
    receipt.end();
  });

  return await doneWriting;
};
