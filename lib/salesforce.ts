import { z } from 'zod';

export const salesforceTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  instance_url: z.string(),
  id: z.string(),
  token_type: z.string(),
  issued_at: z.string(),
  signature: z.string(),
});

export type SalesforceTokenResponse = z.infer<typeof salesforceTokenResponseSchema>;

export async function exchangeCodeForTokens(code: string): Promise<SalesforceTokenResponse> {
  console.log('Starting token exchange...');
  console.log('Environment variables check:', {
    clientId: process.env.SALESFORCE_CLIENT_ID ? 'Present' : 'Missing',
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET ? 'Present' : 'Missing',
    redirectUri: process.env.SALESFORCE_REDIRECT_URI,
  });

  const tokenEndpoint = 'https://login.salesforce.com/services/oauth2/token';
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: process.env.SALESFORCE_CLIENT_ID!,
    client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
    redirect_uri: process.env.SALESFORCE_REDIRECT_URI!,
  });

  console.log('Making token request to:', tokenEndpoint);
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Token exchange failed:', {
      status: response.status,
      statusText: response.statusText,
      error,
    });
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }

  const data = await response.json();
  console.log('Token exchange successful');
  return salesforceTokenResponseSchema.parse(data);
}