import {
  SendEmailCommand,
  SendEmailRequest,
  SESClient,
} from "@aws-sdk/client-ses";

// Options required to create an email request
export interface EmailOpts {
  sender: string;
  recipient: string[];
  subject: string;
  body: string;
  html: string;
}

// Create the request required by SES to send emails
export function createEmailRequest(opts: EmailOpts): SendEmailRequest {
  return {
    Source: opts.sender,
    Destination: {
      ToAddresses: opts.recipient,
    },
    Message: {
      Subject: {
        Data: opts.subject,
        Charset: "utf-8",
      },
      Body: {
        Text: {
          Data: opts.body,
          Charset: "utf-8",
        },
        Html: {
          Data: opts.html,
          Charset: "utf-8",
        },
      },
    },
  };
}

// Attempt to send an email
export async function sendEmail(params: SendEmailRequest) {
  const sesClient = new SESClient({ region: process.env.AWS_SES_REGION });

  const command = new SendEmailCommand(params);

  try {
    const data = await sesClient.send(command);
    console.log(`Message sent: ${data.MessageId}`);
  } catch (error) {
    console.log(`Message failed to send: ${error.message}`);
  }
}
