import { SendEmailRequest, SendEmailResponse } from "@aws-sdk/client-ses";
import { SES, AWSError } from "aws-sdk";

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

// Retrieve SES configuration from ENV.
export function getSESConfig(): SES.Types.ClientConfiguration {
  return {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
  };
}

// Attempt to send an email
export function sendEmail(params: SendEmailRequest) {
  const ses = new SES(getSESConfig());
  ses.sendEmail(params, (err: AWSError, data: SendEmailResponse) => {
    if (err) {
      //throw new Error(`Email failed to send: ${err.message}`);
      console.log(`Message failed to send: ${err.message}`);
    } else {
      console.log(`Message sent: ${data.MessageId}`);
    }
  });
}
