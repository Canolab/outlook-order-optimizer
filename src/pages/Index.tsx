
import React, { useState } from 'react';
import MicrosoftLogin from '@/components/MicrosoftLogin';
import Inbox from './Inbox';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <MicrosoftLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <Inbox />;
};

export default Index;
