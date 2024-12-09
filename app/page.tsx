import { ConnectSalesforceButton } from '@/components/ConnectSalesforceButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">
            Salesforce Integration
          </h1>
          <p className="text-muted-foreground">
            Connect your Salesforce account to get started
          </p>
        </div>
        <ConnectSalesforceButton />
      </div>
    </div>
  );
}