import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Starting Salesforce authorization...');
    console.log('Environment variables check:', {
      clientId: process.env.SALESFORCE_CLIENT_ID ? 'Present' : 'Missing',
      redirectUri: process.env.SALESFORCE_REDIRECT_URI,
    });

    const baseUrl = 'https://metricpal2-dev-ed.develop.my.salesforce.com/services/oauth2/authorize';
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SALESFORCE_CLIENT_ID!,
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI!,
      scope: 'api refresh_token id',
    });

    const authUrl = `${baseUrl}?${params.toString()}`;
    console.log('Generated authorization URL:', authUrl);

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating Salesforce authorization URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}