import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Using Resend for email - you'll need to install it: npm install resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message, category, userEmail, userName } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'CallSubs Support <noreply@callsubs.com>', // Your verified domain
      to: ['support@callsubs.com'],
      replyTo: userEmail || undefined,
      subject: `[${category.toUpperCase()}] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">New Support Request</h2>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${userName} (${userEmail || 'No email'})</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              Sent via CallSubs Support Form on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ 
        error: 'Failed to send support request' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Support request sent successfully',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Error sending support email:', error);
    return NextResponse.json({ 
      error: 'Failed to send support request' 
    }, { status: 500 });
  }
}