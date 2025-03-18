
import React from 'react';
import { useLocation } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Mail, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white">
      <div className="max-w-md w-full mx-auto p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-brand-100 rounded-full flex items-center justify-center">
            <Mail className="h-10 w-10 text-brand-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
        
        <Button 
          size="lg" 
          className="px-6"
          onClick={() => navigate('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
