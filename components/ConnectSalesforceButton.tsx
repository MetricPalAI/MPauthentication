'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CloudLightning } from 'lucide-react';

export function ConnectSalesforceButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      console.log('Initiating Salesforce connection...');
      
      const response = await fetch('/api/auth/salesforce/authorize');
      console.log('Authorization response status:', response.status);
      
      const data = await response.json();
      console.log('Authorization response data:', data);
      
      if (data.url) {
        console.log('Redirecting to Salesforce URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No URL received from authorization endpoint');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to initiate Salesforce connection:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="gap-2"
    >
      <CloudLightning className="h-4 w-4" />
      {isLoading ? 'Connecting...' : 'Connect to Salesforce'}
    </Button>
  );
}