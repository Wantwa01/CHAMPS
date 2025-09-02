// Simple SMS stub - replace with actual provider SDK (Twilio, Africa's Talking, etc.)
export const sendSms = async({ to, message }) => {
    console.log(`[SMS stub] To: ${to} — Message: ${message}`);
    // Example: Twilio (commented)
    // import twilio from 'twilio';
    // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    // return client.messages.create({ body: message, from: process.env.TWILIO_FROM, to });
    return { success: true };
};