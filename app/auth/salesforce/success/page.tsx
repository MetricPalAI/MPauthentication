'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function SalesforceSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  const provider = searchParams.get('provider');
  const connectionId = searchParams.get('connectionId');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const isSuccess = provider === 'salesforce' && connectionId && !error;

  useEffect(() => {
    // If this page was opened in a popup, close it after success
    if (window.opener && isSuccess) {
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, [isSuccess]);

  const handleClose = () => {
    setIsClosing(true);
    if (window.opener) {
      window.close();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Connection Successful
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-destructive" />
                Connection Failed
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? 'Your Salesforce account has been successfully connected.'
              : 'There was a problem connecting your Salesforce account.'}
          </CardDescription>
        </CardHeader>

        {error && (
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Error: {error}</p>
              {errorDescription && (
                <p className="mt-1">{errorDescription}</p>
              )}
            </div>
          </CardContent>
        )}

        <CardFooter className="flex justify-end gap-2">
          <Button
            onClick={handleClose}
            disabled={isClosing}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isClosing ? 'Closing...' : 'Close'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}