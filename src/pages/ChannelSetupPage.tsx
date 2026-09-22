import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChannelSetupPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Forward directly to the interactive 3-step creator studio
    navigate('/create', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
