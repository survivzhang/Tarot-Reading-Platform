interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends an email using SendGrid API
 * Requires SENDGRID_API_KEY environment variable
 */
export async function sendEmail(params: SendEmailParams): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'noreply@aitarotlife.com';

  if (!apiKey) {
    console.warn('SENDGRID_API_KEY not configured, skipping email send');
    return;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: params.to }],
            subject: params.subject,
          },
        ],
        from: { email: fromEmail },
        content: [
          {
            type: 'text/html',
            value: params.html,
          },
          ...(params.text
            ? [
                {
                  type: 'text/plain',
                  value: params.text,
                },
              ]
            : []),
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`SendGrid API error: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Sends welcome email to new users
 */
export async function sendWelcomeEmail(email: string, freeReadingsLeft: number): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Welcome to AI Tarot Life',
    html: `
      <h1>Welcome to AI Tarot Life!</h1>
      <p>Thank you for joining us on your journey of self-discovery and reflection.</p>
      <p>You have <strong>${freeReadingsLeft} free readings</strong> to start with.</p>
      <p>May the cards guide you with wisdom and clarity.</p>
      <br>
      <p>With light and love,<br>The AI Tarot Life Team</p>
    `,
    text: `Welcome to AI Tarot Life! You have ${freeReadingsLeft} free readings to start with.`,
  });
}

/**
 * Sends reading ready notification
 */
export async function sendReadingReadyEmail(email: string, readingId: string): Promise<void> {
  const readingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reading/${readingId}`;

  await sendEmail({
    to: email,
    subject: 'Your Tarot Reading is Ready',
    html: `
      <h1>Your Tarot Reading is Ready</h1>
      <p>The cards have been interpreted and your reading awaits.</p>
      <p><a href="${readingUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Your Reading</a></p>
      <br>
      <p>May these insights serve you well.</p>
    `,
    text: `Your tarot reading is ready. View it here: ${readingUrl}`,
  });
}

/**
 * Sends payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  readingsGranted: number,
  isLifetime: boolean
): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Payment Confirmed - Thank You!',
    html: `
      <h1>Thank You for Your Support!</h1>
      <p>Your payment has been confirmed.</p>
      ${
        isLifetime
          ? '<p>You now have <strong>Lifetime Membership</strong> with up to 365 readings per year.</p>'
          : `<p><strong>${readingsGranted} reading${readingsGranted > 1 ? 's' : ''}</strong> ${readingsGranted > 1 ? 'have' : 'has'} been added to your account.</p>`
      }
      <p>We deeply appreciate your trust and support.</p>
    `,
    text: isLifetime
      ? 'Payment confirmed! You now have Lifetime Membership.'
      : `Payment confirmed! ${readingsGranted} readings have been added to your account.`,
  });
}

/**
 * Sends referral reward email
 */
export async function sendReferralRewardEmail(email: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'You Earned a Free Reading!',
    html: `
      <h1>Congratulations!</h1>
      <p>Your friend has completed their first reading using your referral link.</p>
      <p>As a thank you, we've added <strong>1 free reading</strong> to your account.</p>
      <p>Thank you for sharing AI Tarot Life with others!</p>
    `,
    text: 'You earned a free reading through your referral! Thank you for sharing AI Tarot Life.',
  });
}
