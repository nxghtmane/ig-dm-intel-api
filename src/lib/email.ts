import { Resend } from 'resend';

// Function-based initialization to ensure top-level doesn't crash
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendApiKeyEmail(email: string, apiKey: string, tier: string = 'Starter', limit: number = 100) {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('RESEND_ERROR: Missing RESEND_API_KEY environment variable.');
      return { success: false, error: 'Email service not configured on the server.' };
    }

    console.log(`Attempting to send email to ${email} for tier ${tier}...`);
    const { data, error } = await resend.emails.send({
      from: 'Neural Architect <keys@symm.digital>',
      to: [email],
      subject: `Your ${tier} API Key - Neural Architect`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #6366f1;">Neural Architect Intelligence</h1>
          <p>Hello,</p>
          <p>Thank you for choosing Neural Architect for your Instagram DM intelligence. Your <strong>${tier}</strong> API key has been generated successfully.</p>
          
          <div style="background: #f4f4f7; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: monospace; border: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">YOUR API KEY:</p>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #0f172a; word-break: break-all;">${apiKey}</p>
          </div>

          <p><strong>Tier:</strong> ${tier}</p>
          <p><strong>Monthly Limit:</strong> ${limit.toLocaleString()} Requests</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="font-size: 14px; color: #666;">
            Need help? Check our <a href="https://symm.digital/docs" style="color: #6366f1;">Documentation</a> or reply to this email.
          </p>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            © 2026 Neural Architect API. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('RESEND_ERROR_DETECTED:', JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    console.log('RESEND_SUCCESS:', data?.id);
    return { success: true, data };
  } catch (err: any) {
    console.error('RESEND_CRITICAL_FAILURE:', err.message);
    return { success: false, error: err.message };
  }
}
