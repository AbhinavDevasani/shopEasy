import { sendEmail } from '../src/services/emailService.js';

const to = process.argv[2];

if (!to) {
    console.error("Please provide a recipient email address as an argument.");
    console.error("Usage: node scripts/test-brevo.js <recipient_email>");
    process.exit(1);
}

const subject = "Test Email from ShopEasy";
const htmlContent = "<h1>It Works!</h1><p>This is a test email sent using Brevo integration.</p>";

(async () => {
    try {
        console.log(`Sending email to ${to}...`);
        await sendEmail(to, subject, htmlContent);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Failed to send email:", error);
    }
})();
