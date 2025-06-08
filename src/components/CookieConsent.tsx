
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('user-id', generateUserId());
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  const generateUserId = () => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Card className="bg-gray-800/95 backdrop-blur-md border-gray-700 p-6 shadow-2xl animate-slide-in-right">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Cookie className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Cookie Consent</h3>
            <p className="text-gray-300 text-sm mb-4">
              We use cookies to enhance your experience, track offer completions, and provide personalized rewards. 
              Your privacy is important to us.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleAccept}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                size="sm"
              >
                Accept
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
                size="sm"
              >
                Decline
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDecline}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
