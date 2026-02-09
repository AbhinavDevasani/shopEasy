import brevo from '@getbrevo/brevo';
import 'dotenv/config';

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const sendEmail = async (to, subject, htmlContent) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { "name": "NextBuy", "email": process.env.BREVO_SENDER_EMAIL || "no-reply@shopeasy.com" };
    console.log(to)
    sendSmtpEmail.to = [{ "email": to }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
