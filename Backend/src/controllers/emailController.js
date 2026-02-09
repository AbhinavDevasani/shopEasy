import { sendEmail } from '../services/emailService.js';

export const sendTestEmail = async (req, res) => {
    const { to, subject, htmlContent } = req.body;

    if (!to || !subject || !htmlContent) {
        return res.status(400).json({ error: "Missing required fields: to, subject, htmlContent" });
    }

    try {
        const result = await sendEmail(to, subject, htmlContent);
        res.status(200).json({ message: "Email sent successfully", data: result });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
};
