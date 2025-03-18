
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authenticateWithMicrosoft } from '@/utils/msGraph';
import { Mail } from 'lucide-react';

interface MicrosoftLoginProps {
  onLoginSuccess: () => void;
}

export const MicrosoftLogin: React.FC<MicrosoftLoginProps> = ({ onLoginSuccess }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    
    try {
      const result = await authenticateWithMicrosoft();
      
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-brand-100 rounded-full flex items-center justify-center">
              <Mail className="h-10 w-10 text-brand-600" />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Outlook Order Optimizer</h1>
          <p className="mt-2 text-gray-600">
            Process, analyze, and optimize your order emails efficiently
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <Button
          className="w-full py-6 text-base font-medium bg-brand-600 hover:bg-brand-700"
          size="lg"
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Connecting...' : 'Connect with Microsoft'}
        </Button>
        
        <p className="mt-6 text-sm text-center text-gray-500">
          By connecting, you authorize this application to access your Outlook emails for optimization purposes.
        </p>
      </div>
    </div>
  );
};

export default MicrosoftLogin;
