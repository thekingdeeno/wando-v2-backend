import { autoInjectable } from 'tsyringe';
import { Transporter, createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { mailer } from '../../config/env.config';


@autoInjectable()
class MessagingService {
  private readonly transporter?: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = this.getTransporter();

  }

  private getTransporter() {
    return createTransport({
      service: mailer.service,
      auth: {
        user: mailer.auth.user,
        pass: mailer.auth.pass,
      },
    });
  }

  private async send(options: MailOptions) {
    try {
      const response = await this.transporter?.sendMail(options);
      return response
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async sendEmail(email: { subject: any; recipient: any; message: any; }) {
    try {
      const { subject, recipient, message } = email;

      const params = {
        from: mailer.from,
        to: recipient,
        subject,
        text: message,
      };

      const response = await this.send(params);

      return {
        response: response,
        message: 'Email sent successfully',
      };
    } catch (error: any) {
        throw {status: false, message: error.message || 'something went wrong'};
    };
  };

  public async sendAccountVerificationWithOtpEmail(email: string, otp: string) {
    try {
      const params = {
        from: mailer.from,
        to: email,
        subject: 'Verify Account',
        html: `<p> Dear customer, <br/> Please verify your account. Your otp is ${otp}.</p>
                <br />
                `,
        text: 'If you didnt initiate this, kindly ignore!',
      }

      const response = await this.send(params);
      return {
        response: response,
        message: 'Email sent successfully',
      };

    } catch (error) {
        throw {status: false, message: error.message || 'something went wrong'};
    }
  }
}

export default MessagingService;
