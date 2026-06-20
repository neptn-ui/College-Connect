import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-base">
      <div className="glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
      <div className="noise-overlay" />

      <div className="relative z-10 text-center max-w-lg px-4 flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-8 mx-auto rotate-12 relative group">
          <div className="absolute inset-0 bg-brand/20 blur-xl rounded-3xl group-hover:bg-brand/30 transition-all duration-500" />
          <Map className="w-12 h-12 text-brand relative z-10" />
        </div>

        <h1 className="text-7xl font-black mb-4 gradient-text tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Lost on Campus?</h2>
        
        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
          Looks like you've wandered into an uncharted area. This page doesn't exist in our directory.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            variant="outline" 
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button 
            variant="primary" 
            icon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};
