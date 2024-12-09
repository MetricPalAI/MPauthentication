import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { exchangeCodeForTokens } from '@/lib/salesforce';

// Mark this route as dynamic since it handles OAuth callbacks
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('Received callback request');
    
    // Extract authorization code from URL parameters
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    console.log('Callback parameters:', {
      code: code ? 'Present' : 'Missing',
      error,
      errorDescription,
    });

    // Handle OAuth error responses
    if (error) {
      console.error('Salesforce OAuth error:', error, errorDescription);
      const errorUrl = new URL('/auth/salesforce/success', url.origin);
      errorUrl.searchParams.set('error', error);
      if (errorDescription) {
        errorUrl.searchParams.set('error_description', errorDescription);
      }
      return NextResponse.redirect(errorUrl.toString());
    }

    // Validate authorization code
    if (!code) {
      console.error('Missing authorization code');
      const errorUrl = new URL('/auth/salesforce/success', url.origin);
      errorUrl.searchParams.set('error', 'missing_code');
      errorUrl.searchParams.set('error_description', 'Authorization code is missing');
      return NextResponse.redirect(errorUrl.toString());
    }

    console.log('Exchanging code for tokens...');
    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);
    console.log('Received tokens:', {
      accessToken: tokens.access_token ? 'Present' : 'Missing',
      refreshToken: tokens.refresh_token ? 'Present' : 'Missing',
      instanceUrl: tokens.instance_url,
    });

    console.log('Storing connection in Supabase...');
    // Store connection in Supabase
    const { data: connection, error: insertError } = await supabase
      .from('integration_connections')
      .insert([
        {
          provider: 'salesforce',
          credentials: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            instance_url: tokens.instance_url,
          },
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Failed to store Salesforce connection:', insertError);
      const errorUrl = new URL('/auth/salesforce/success', url.origin);
      errorUrl.searchParams.set('error', 'database_error');
      errorUrl.searchParams.set('error_description', 'Failed to store connection');
      return NextResponse.redirect(errorUrl.toString());
    }

    console.log('Successfully stored connection:', connection.id);
    // Redirect to success page with connection ID
    const successUrl = new URL('/auth/salesforce/success', url.origin);
    successUrl.searchParams.set('provider', 'salesforce');
    successUrl.searchParams.set('connectionId', connection.id);

    return NextResponse.redirect(successUrl.toString());
  } catch (error) {
    console.error('Error handling Salesforce callback:', error);
    // Create error URL using the request URL's origin or fallback to process.env
    const errorUrl = new URL('/auth/salesforce/success', 
      new URL(request.url).origin
    );
    errorUrl.searchParams.set('error', 'server_error');
    errorUrl.searchParams.set('error_description', 'Internal server error');
    return NextResponse.redirect(errorUrl.toString());
  }
}