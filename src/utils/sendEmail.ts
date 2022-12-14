import { createTransport } from "nodemailer";
import { env } from "src/env/server.mjs";

interface SendEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export const sendEmail = async (props: SendEmail) => {
  const transporter = createTransport(env.EMAIL_SERVER);

  const result = await transporter.sendMail({
    from: env.EMAIL_FROM,
    ...props,
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }

  return transporter;
};
